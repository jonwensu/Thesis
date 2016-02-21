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
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $date = new \DateTime('now');
            $em = $this->getDoctrine()->getManager();
            $boards = $em->getRepository("ThesisBulletinBundle:Board")->findAll();
            $entity->setDatePosted($date);
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
     * Displays a form to create a new ImageAnnouncement entity.
     *
     * @Route("/new", name="announcement_image_new")
     * @Method("GET")
     * @Template()
     */
    public function newAction() {
        $entity = new ImageAnnouncement();
        $form = $this->createCreateForm($entity);

        $files = $request->files;
        $em = $this->getDoctrine()->getManager();
        $ids = [];

        foreach ($files as $file) {
            $document = new Document();
            $document
                    ->setFile($file);
            $em->persist($document);
            $ids[] = $document;
        }
        $em->flush();

        return array(
            'entity' => $entity,
            'form' => $form->createView(),
        );
    }

    /**
     * Finds and displays a ImageAnnouncement entity.
     *
     * @Route("/{id}", name="announcement_image_show")
     * @Method("GET")
     * @Template()
     */
    public function showAction($id) {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('ThesisBulletinBundle:ImageAnnouncement')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find ImageAnnouncement entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity' => $entity,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to edit an existing ImageAnnouncement entity.
     *
     * @Route("/{id}/edit", name="announcement_image_edit")
     * @Method("GET")
     * @Template()
     */
    public function editAction($id) {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('ThesisBulletinBundle:ImageAnnouncement')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find ImageAnnouncement entity.');
        }

        $editForm = $this->createEditForm($entity);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity' => $entity,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Creates a form to edit a ImageAnnouncement entity.
     *
     * @param ImageAnnouncement $entity The entity
     *
     * @return Form The form
     */
    private function createEditForm(ImageAnnouncement $entity) {
        $form = $this->createForm(new ImageAnnouncementType(), $entity, array(
            'action' => $this->generateUrl('announcement_image_update', array('id' => $entity->getId())),
            'method' => 'PUT',
        ));

        $form->add('submit', 'submit', array('label' => 'Update'));

        return $form;
    }

    /**
     * Edits an existing ImageAnnouncement entity.
     *
     * @Route("/{id}", name="announcement_image_update")
     * @Method("PUT")
     * @Template("ThesisBulletinBundle:ImageAnnouncement:edit.html.twig")
     */
    public function updateAction(Request $request, $id) {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('ThesisBulletinBundle:ImageAnnouncement')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find ImageAnnouncement entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createEditForm($entity);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $em->flush();

            return $this->redirect($this->generateUrl('announcement_image_edit', array('id' => $id)));
        }

        return array(
            'entity' => $entity,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a ImageAnnouncement entity.
     *
     * @Route("/{id}", name="announcement_image_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, $id) {
        $form = $this->createDeleteForm($id);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('ThesisBulletinBundle:ImageAnnouncement')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find ImageAnnouncement entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('announcement_image'));
    }

    /**
     * Creates a form to delete a ImageAnnouncement entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return Form The form
     */
    private function createDeleteForm($id) {
        return $this->createFormBuilder()
                        ->setAction($this->generateUrl('announcement_image_delete', array('id' => $id)))
                        ->setMethod('DELETE')
                        ->add('submit', 'submit', array('label' => 'Delete'))
                        ->getForm()
        ;
    }

}
