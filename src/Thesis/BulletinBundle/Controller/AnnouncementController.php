<?php

namespace Thesis\BulletinBundle\Controller;

use FOS\RestBundle\Controller\Annotations\View;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Form;
use Symfony\Component\Form\FormErrorIterator;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Thesis\BulletinBundle\Entity\Announcement;
use Thesis\BulletinBundle\Entity\PlainAnnouncement;
use Thesis\BulletinBundle\Form\AnnouncementType;

/**
 * Announcement controller.
 *
 * @Route("/announcement")
 */
class AnnouncementController extends Controller {

    /**
     * Lists all Announcement entities.
     *
     * @Route("/", name="announcement")
     * @Method("GET")
     * @Template()
     */
    public function indexAction() {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('ThesisBulletinBundle:Announcement')->findAll();

        return array(
            'entities' => $entities,
        );
    }

    /**
     * Creates a new Announcement entity.
     *
     * @Route("/create", name="announcement_create", options={"expose"=true})
     * @Method("POST")
     */
    public function createAction(Request $request) {
        $entity = new PlainAnnouncement();
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $date = new \DateTime('now');
            $content = $request->request->get('html_format');
            $em = $this->getDoctrine()->getManager();
            $boards = $em->getRepository("ThesisBulletinBundle:Board")->findAll();
            $entity->setDatePosted($date)
                    ->setContent($content);
            $em->persist($entity);
            $em->flush();
            $response = ['valid' => true];
            return new JsonResponse($response);
        }

        $t = $form['title']->getErrors(true);
        $c = $form['content']->getErrors(true);
        $titleErrors = $this->getErrorMsgs($t);
        $contentErrors = $this->getErrorMsgs($c);
        $formErrors = $this->getErrorMsgs($form->getErrors(true));
        $errors = array_merge([$titleErrors, $contentErrors, $formErrors]);
        $fields = [];

        if ($t->count() > 0) {
            $fields[] = 'title';
        }

        if ($c->count() > 0) {
            $fields[] = 'content';
        }


        $response = ['valid' => false, 'errors' => $errors, 'fields' => $fields];


        return new JsonResponse($response);
    }

    private function getErrorMsgs(FormErrorIterator $errors) {
        $e = [];
        foreach ($errors as $error) {
            $e[] = $errors->current()->getMessage();
            $errors->next();
        }
        return $e;
    }

    /**
     * Creates a form to create a Announcement entity.
     *
     * @param Announcement $entity The entity
     *
     * @return Form The form
     */
    private function createCreateForm(Announcement $entity) {
        $form = $this->createForm(new AnnouncementType(), $entity, array(
            'action' => $this->generateUrl('announcement_create'),
            'method' => 'POST',
        ));

        $form->add('submit', 'submit', array('label' => 'Create'));

        return $form;
    }

    /**
     * @View()
     */
    public function getAnnouncementsAllAction() {

        return [
            'announcements' => $this->getDoctrine()
                    ->getManager()
                    ->getRepository('ThesisBulletinBundle:Announcement')
                    ->findAllSorted()
        ];
    }

    /**
     * @View()
     */
    public function getAnnouncementsVisibleAction($id) {

        return [
            'announcements' => $this->getDoctrine()
                    ->getManager()
                    ->getRepository('ThesisBulletinBundle:Board')
                    ->find($id)
                    ->getVisibleAnnouncements()
        ];
    }
    
    /**
     * @View(serializerGroups={"search"},)
     */
    public function getAnnouncementsSearchAction($id) {

        return [
            'announcements' => $this->getDoctrine()
                    ->getManager()
                    ->getRepository('ThesisBulletinBundle:Board')
                    ->find($id)
                    ->getVisibleAnnouncements()
        ];
    }

    /**
     * @View()
     */
    public function getAnnouncementsForAction($id) {

        return [
            'announcements' => $this->getDoctrine()
                    ->getManager()
                    ->getRepository('ThesisBulletinBundle:Board')
                    ->find($id)
                    ->getAnnouncements()
        ];
    }
    
    /**
     * @View()
     */
    public function getAnnouncementAction($id) {

        return [
            'announcement' => $this->getDoctrine()
                    ->getManager()
                    ->getRepository('ThesisBulletinBundle:Announcement')
                    ->find($id)
        ];
    }

}
