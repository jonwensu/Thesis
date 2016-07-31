<?php

namespace Thesis\BulletinBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Form;
use Symfony\Component\Form\FormErrorIterator;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Thesis\BulletinBundle\Entity\Board;
use Thesis\BulletinBundle\Entity\Document;
use Thesis\BulletinBundle\Entity\ImageAnnouncement;
use Thesis\BulletinBundle\Form\ImageAnnouncementType;

/**
 * ImageAnnouncement controller.
 *
 * @Route("/announcement/image")
 */
class ImageAnnouncementController extends Controller {

    /**
     * Lists all ImageAnnouncement entities.
     *
     * @Route("/", name="announcement_image")
     * @Method("GET")
     * @Template()
     */
    public function indexAction() {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('ThesisBulletinBundle:ImageAnnouncement')->findAll();

        return array(
            'entities' => $entities,
        );
    }

    /**
     * Creates a new ImageAnnouncement entity.
     *
     * @Route("/", name="announcement_image_create", options={"expose"=true})
     * @Method("POST")
     */
    public function createAction(Request $request) {
        $entity = new ImageAnnouncement();
        $visible = $request->request->get('visible');
        $pinned = $request->request->get('pinned');
        $entity->setPinned($pinned == "true");
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $date = new \DateTime('now');
            $em = $this->getDoctrine()->getManager();
            $boards = $em->getRepository("ThesisBulletinBundle:Board")->findAll();
            $entity->setDatePosted($date)
                    ->setEncoder($this->getUser())
                    ->setVisible($visible == "true")
            ;
            $em->persist($entity);

            $board = null;
            if (count($boards) < 1) {
                $board = new Board();
            } else {
                $board = $boards[0];
            }

            $board->addAnnouncement($entity);
            $em->persist($board);

            $em->flush();
            $response = ['valid' => true, 'id' => $entity->getId()];
            return new JsonResponse($response);
        }

        $t = $form['title']->getErrors(true);
        $c = $form['description']->getErrors(true);
        $titleErrors = $this->getErrorMsgs($t);
        $contentErrors = $this->getErrorMsgs($c);
        $formErrors = $this->getErrorMsgs($form->getErrors(true));
        $errors = array_merge([$titleErrors, $contentErrors, $formErrors]);
        $fields = [];

        if ($t->count() > 0) {
            $fields[] = 'title';
        }

        if ($c->count() > 0) {
            $fields[] = 'description';
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
     * Creates a form to create a ImageAnnouncement entity.
     *
     * @param ImageAnnouncement $entity The entity
     *
     * @return Form The form
     */
    private function createCreateForm(ImageAnnouncement $entity) {
        $form = $this->createForm(new ImageAnnouncementType(), $entity, array(
            'action' => $this->generateUrl('announcement_image_create'),
            'method' => 'POST',
        ));

        $form->add('submit', 'submit', array('label' => 'Create'));

        return $form;
    }

    /**
     *
     * @Route("/edit", name="announcement_image_edit", options={"expose"=true})
     * @Method("POST")
     */
    public function updateAction(Request $request) {

        $visible = $request->request->get('visible');
        $id = $request->request->get('id');
        $changed = $request->request->get('changed');
        $docId = $request->request->get('docId');
        $em = $this->getDoctrine()->getManager();
        $entity = $em->getRepository('ThesisBulletinBundle:Announcement')->find($id);
        $pinned = $request->request->get('pinned');
        $entity->setPinned($pinned == "true");
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $date = new \DateTime('now');

            $boards = $em->getRepository("ThesisBulletinBundle:Board")->findAll();
            $entity->setDatePosted($date)
                    ->setEncoder($this->getUser())
                    ->setVisible($visible == "true")
            ;

            if ($changed == 'true') {
                $doc = $em->getRepository('ThesisBulletinBundle:Document')->find($docId);
                $doc->removeUpload();
                $entity->setDocument(null);
                $em->persist($entity);
                $em->remove($doc);
            }


            $board = null;
            if (count($boards) < 1) {
                $board = new Board();
            } else {
                $board = $boards[0];
            }

            $board->addAnnouncement($entity);
            $em->persist($board);

            $em->flush();
            $response = ['valid' => true, 'id' => $entity->getId()];
            return new JsonResponse($response);
        }

        $t = $form['title']->getErrors(true);
        $c = $form['description']->getErrors(true);
        $titleErrors = $this->getErrorMsgs($t);
        $contentErrors = $this->getErrorMsgs($c);
        $formErrors = $this->getErrorMsgs($form->getErrors(true));
        $errors = array_merge([$titleErrors, $contentErrors, $formErrors]);
        $fields = [];

        if ($t->count() > 0) {
            $fields[] = 'title';
        }

        if ($c->count() > 0) {
            $fields[] = 'description';
        }


        $response = ['valid' => false, 'errors' => $errors, 'fields' => $fields];


        return new JsonResponse($response);
    }

}
