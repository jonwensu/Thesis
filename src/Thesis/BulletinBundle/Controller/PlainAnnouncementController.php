<?php

namespace Thesis\BulletinBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Form;
use Symfony\Component\Form\FormErrorIterator;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Thesis\BulletinBundle\Entity\Board;
use Thesis\BulletinBundle\Entity\PlainAnnouncement;
use Thesis\BulletinBundle\Form\PlainAnnouncementType;

/**
 * PlainAnnouncement controller.
 *
 * @Route("/announcement/plain")
 */
class PlainAnnouncementController extends Controller {

    /**
     * Creates a new PlainAnnouncement entity.
     *
     * @Route("/create", name="announcement_plain_create", options={"expose"=true})
     * @Method("POST")
     */
    public function createAction(Request $request) {
        $entity = new PlainAnnouncement();
        $visible = $request->request->get('visible');
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
            $response = ['valid' => $entity->getVisible()];
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
     * Creates a form to create a PlainAnnouncement entity.
     *
     * @param PlainAnnouncement $entity The entity
     *
     * @return Form The form
     */
    private function createCreateForm(PlainAnnouncement $entity) {
        $form = $this->createForm(new PlainAnnouncementType(), $entity, array(
            'action' => $this->generateUrl('announcement_create'),
            'method' => 'POST',
        ));

        $form->add('submit', 'submit', array('label' => 'Create'));

        return $form;
    }

    /**
     *
     * @Route("/edit", name="announcement_plain_edit", options={"expose"=true})
     * @Method("POST")
     */
    public function updateAction(Request $request) {
        $em = $this->getDoctrine()->getManager();
        $visible = $request->request->get('visible');
        $id = $request->request->get('id');
        $entity = $em->getRepository("ThesisBulletinBundle:Announcement")->find($id);
        $currVis = $entity->getVisible();
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $entity->setVisible($visible == "true")
                    ->setEncoder($this->getUser())
                    ;
            
            if(!$visible && $visible != $currVis){
                $date = new \DateTime('now');
                $entity->setDatePosted($date);
            }

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

}
