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
use Thesis\BulletinBundle\Entity\Faculty;
use Thesis\BulletinBundle\Form\FacultyType;

/**
 * Faculty controller.
 *
 * @Route("/faculty")
 */
class FacultyController extends Controller {

    /**
     * Creates a new Faculty entity.
     *
     * @Route("/", name="faculty_create", options={"expose"=true})
     */
    public function createAction(Request $request) {
        $entity = new Faculty();
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);


        if ($form->isValid()) {
            $id = $request->request->get('id');
            $em = $this->getDoctrine()->getManager();
            $dep = $em->getRepository("ThesisBulletinBundle:Department")->find($id);
            $entity->setDepartment($dep);
            $em->persist($entity);
            $em->flush();

            $response = ['valid' => true, 'id' => $entity->getId()];
            return new JsonResponse($response);
        }


        $f = $form['firstName']->getErrors(true);
        $l = $form['lastName']->getErrors(true);
        $e = $form['email']->getErrors(true);
        $firstNameErrors = $this->getErrorMsgs($f);
        $lastNameErrors = $this->getErrorMsgs($l);
        $emailErrors = $this->getErrorMsgs($e);
        $formErrors = $this->getErrorMsgs($form->getErrors(true));
        $errors = array_unique([$firstNameErrors, $lastNameErrors, $emailErrors, $formErrors], SORT_REGULAR);
        $fields = [];

        if ($f->count() > 0) {
            $fields[] = 'class.firstName';
        }
        if ($l->count() > 0) {
            $fields[] = 'class.lastName';
        }

        if ($e->count() > 0) {
            $fields[] = 'class.email';
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
     * Creates a form to create a Faculty entity.
     *
     * @param Faculty $entity The entity
     *
     * @return Form The form
     */
    private function createCreateForm(Faculty $entity) {
        $form = $this->createForm(new FacultyType(), $entity, array(
            'action' => $this->generateUrl('faculty_create'),
            'method' => 'POST',
        ));

        $form->add('submit', 'submit', array('label' => 'Create'));

        return $form;
    }

    /**
     * Edits an existing Faculty entity.
     *
     * @Route("/edit", name="faculty_update", options={"expose"=true})
     * @Method("POST")
     */
    public function updateAction(Request $request) {
        $id = $request->request->get('id');
        $changed = $request->request->get('changed');
        $em = $this->getDoctrine()->getManager();
        $docId = $request->request->get('docId');
        $entity = $em->getRepository("ThesisBulletinBundle:Faculty")->find($id);
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);


        if ($form->isValid()) {
            $depId = $request->request->get('dep_id');
            $dep = $em->getRepository("ThesisBulletinBundle:Department")->find($depId);
            $entity->setDepartment($dep);



            if ($changed == 'true') {
                $doc = $em->getRepository('ThesisBulletinBundle:Document')->find($docId);
                $doc->removeUpload();
                $entity->setPicture(null);
                $em->persist($entity);
                $em->remove($doc);
            } else {
                $em->persist($entity);
            }
            $em->flush();

            $response = ['valid' => true, 'id' => $entity->getId()];
            return new JsonResponse($response);
        }


        $f = $form['firstName']->getErrors(true);
        $l = $form['lastName']->getErrors(true);
        $e = $form['email']->getErrors(true);
        $firstNameErrors = $this->getErrorMsgs($f);
        $lastNameErrors = $this->getErrorMsgs($l);
        $emailErrors = $this->getErrorMsgs($e);
        $formErrors = $this->getErrorMsgs($form->getErrors(true));
        $errors = array_unique([$firstNameErrors, $lastNameErrors, $emailErrors, $formErrors], SORT_REGULAR);
        $fields = [];

        if ($f->count() > 0) {
            $fields[] = 'class.firstName';
        }
        if ($l->count() > 0) {
            $fields[] = 'class.lastName';
        }

        if ($e->count() > 0) {
            $fields[] = 'class.email';
        }


        $response = ['valid' => false, 'errors' => $errors, 'fields' => $fields];


        return new JsonResponse($response);
    }

    /**
     * @Method("POST")
     * @Route("/delete", name="faculty_delete", options={"expose"=true})
     */
    public function deleteAction(Request $request) {
        $password = $request->request->get('password');
        $id = $request->request->get('id');
        $user = $this->getUser();

        $encoder_service = $this->get('security.encoder_factory');
        $encoder = $encoder_service->getEncoder($user);
        $encoded_pass = $encoder->encodePassword($password, $user->getSalt());
        $em = $this->getDoctrine()->getManager();
        $target = $em
                ->getRepository('ThesisBulletinBundle:Faculty')
                ->find($id);


        $match = $encoded_pass == $user->getPassword();

        if ($match) {

            $em->persist($target);
            $em->remove($target);
            $em->flush();
        }
        return new JsonResponse(['match' => true]);
    }

    /**
     * @View(serializerGroups={"search"})
     */
    public function getFacultyAllMembersAction() {
        return [
            'faculty' => $this->getDoctrine()
                    ->getRepository("ThesisBulletinBundle:Faculty")
                    ->findAllSorted()
                ]
        ;
    }

    /**
     * @View()
     */
    public function getFacultyAction($id) {
        return [
            'faculty' => $this->getDoctrine()
                    ->getRepository("ThesisBulletinBundle:Faculty")
                    ->find($id)
                ]
        ;
    }

}
