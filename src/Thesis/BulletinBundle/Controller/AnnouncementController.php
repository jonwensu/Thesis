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
use Thesis\BulletinBundle\Entity\ImageAnnouncement;
use Thesis\BulletinBundle\Entity\PlainAnnouncement;
use Thesis\BulletinBundle\Form\AnnouncementType;

/**
 * Announcement controller.
 *
 * @Route("/announcement")
 */
class AnnouncementController extends Controller {

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
    public function getAnnouncementsOverviewAction() {

        $em = $this->getDoctrine()->getManager();

        return [
            'encoded' => $em
                    ->getRepository('ThesisBulletinBundle:User')
                    ->find($this->getUser()->getId())
                    ->getAnnouncements(),
            'all' => $em
                    ->getRepository('ThesisBulletinBundle:Announcement')
                    ->findAll()
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

    /**
     * @View()
     */
    public function getAnnouncementsPinnedAction($id) {

        return [
            'announcements' => $this->getDoctrine()
                    ->getManager()
                    ->getRepository('ThesisBulletinBundle:Board')
                    ->find($id)
                    ->getPinnedAnnouncements()
        ];
    }

    /**
     * @Route("/toggle/visibility", name="toggle_visibility", options={"expose"=true})
     * @Method("POST")
     */
    public function setAnnouncementVisibilityAction(Request $request) {
        if ($request->isXmlHttpRequest()) {
            $id = $request->request->get('id');

            if (!$id) {
                return new JsonResponse(['valid' => false]);
            }

            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository("ThesisBulletinBundle:Announcement")->find($id);
            $visible = $entity->getVisible();
            $entity->setVisible(!$visible);

            if (!$visible) {
                $date = new \DateTime('now');
                $entity->setDatePosted($date);
            }

            $em->persist($entity);
            $em->flush();

            return new JsonResponse(['valid' => true]);
        }
        return new JsonResponse(['valid' => false]);
    }

    /**
     * @Method("POST")
     * @Route("/delete", name="announcement_delete", options={"expose"=true})
     */
    public function deleteAction(Request $request) {
        $password = $request->request->get('password');
        $id = $request->request->get('id');
        $user = $this->getUser();
        $encoder_service = $this->get('security.encoder_factory');
        $encoder = $encoder_service->getEncoder($user);
        $encoded_pass = $encoder->encodePassword($password, $user->getSalt());

        $match = $encoded_pass == $user->getPassword();

        if ($match) {
            $em = $this->getDoctrine()->getManager();
            $target = $em->getRepository("ThesisBulletinBundle:Announcement")->find($id);
            $img = new ImageAnnouncement();

            if ($target instanceof $img) {
                $doc = $em->getRepository("ThesisBulletinBundle:Document")->find($target->getDocument()->getId());
                $doc->removeUpload();
                $em->remove($doc);
            }
            
            $em->remove($target);
            $em->flush();


            return new JsonResponse(['match' => $match]);
        }
        return new JsonResponse(['match' => $match]);
    }

}
