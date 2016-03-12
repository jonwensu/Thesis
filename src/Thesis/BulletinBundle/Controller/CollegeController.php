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
use Thesis\BulletinBundle\Entity\College;
use Thesis\BulletinBundle\Form\CollegeType;

/**
 * College controller.
 *
 * @Route("/college")
 */
class CollegeController extends Controller {

    /**
     * Lists all College entities.
     *
     * @Route("/", name="college")
     * @Method("GET")
     * @Template()
     */
    public function indexAction() {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('ThesisBulletinBundle:College')->findAll();

        return array(
            'entities' => $entities,
        );
    }

    /**
     * Creates a new College entity.
     *
     * @Route("/", name="college_create", options={"expose"=true})
     * @Method("POST")
     */
    public function createAction(Request $request) {
        $entity = new College();
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            $response = ['valid' => true];
            return new JsonResponse($response);
        }


        $n = $form['name']->getErrors(true);
        $nameErrors = $this->getErrorMsgs($n);
        $formErrors = $this->getErrorMsgs($form->getErrors(true));
        $errors = array_unique([$nameErrors, $formErrors], SORT_REGULAR);
        $fields = [];

        if ($n->count() > 0) {
            $fields[] = 'name';
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
     * Creates a form to create a College entity.
     *
     * @param College $entity The entity
     *
     * @return Form The form
     */
    private function createCreateForm(College $entity) {
        $form = $this->createForm(new CollegeType(), $entity, array(
            'action' => $this->generateUrl('college_create'),
            'method' => 'POST',
        ));

        $form->add('submit', 'submit', array('label' => 'Create'));

        return $form;
    }

    /**
     * Displays a form to create a new College entity.
     *
     * @Route("/new", name="college_new")
     * @Method("GET")
     * @Template()
     */
    public function newAction() {
        $entity = new College();
        $form = $this->createCreateForm($entity);

        return array(
            'entity' => $entity,
            'form' => $form->createView(),
        );
    }

    /**
     * Finds and displays a College entity.
     *
     * @Route("/{id}", name="college_show")
     * @Method("GET")
     * @Template()
     */
    public function showAction($id) {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('ThesisBulletinBundle:College')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find College entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity' => $entity,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing College entity.
     *
     * @Route("/edit", name="college_update", options={"expose"=true})
     * @Method("POST")
     */
    public function updateAction(Request $request) {
        $id = $request->request->get('id');
        $em = $this->getDoctrine()->getManager();
        $entity = $em->getRepository('ThesisBulletinBundle:College')->find($id);
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);

        if ($form->isValid()) {

            $em->persist($entity);
            $em->flush();

            $response = ['valid' => true];
            return new JsonResponse($response);
        }


        $n = $form['name']->getErrors(true);
        $nameErrors = $this->getErrorMsgs($n);
        $formErrors = $this->getErrorMsgs($form->getErrors(true));
        $errors = array_unique([$nameErrors, $formErrors], SORT_REGULAR);
        $fields = [];

        if ($n->count() > 0) {
            $fields[] = 'name';
        }


        $response = ['valid' => false, 'errors' => $errors, 'fields' => $fields];


        return new JsonResponse($response);
    }

    /**
     * Deletes a College entity.
     *
     * @Route("/delete", name="college_delete", options={"expose"=true})
     * @Method("POST")
     */
    public function deleteAction(Request $request) {

        $password = $request->request->get('password');
        $id = $request->request->get('id');
        $user = $this->getUser();

        $encoder_service = $this->get('security.encoder_factory');
        $encoder = $encoder_service->getEncoder($user);
        $encoded_pass = $encoder->encodePassword($password, $user->getSalt());
        $em = $this->getDoctrine()->getManager();
        $entity = $em->getRepository('ThesisBulletinBundle:College')->find($id);

        if (count($entity->getDepartments()) > 0) {
            return new JsonResponse(['match' => false]);
        }

        $match = $encoded_pass == $user->getPassword();
        if ($match) {
            $em->remove($entity);
            $em->flush();
        }

        return new JsonResponse(['match' => $match]);
    }

    /**
     * Creates a form to delete a College entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return Form The form
     */
    private function createDeleteForm($id) {
        return $this->createFormBuilder()
                        ->setAction($this->generateUrl('college_delete', array('id' => $id)))
                        ->setMethod('DELETE')
                        ->add('submit', 'submit', array('label' => 'Delete'))
                        ->getForm()
        ;
    }

    /**
     * @View()
     */
    public function getCollegesAction() {
        return [
            'colleges' => $this->getDoctrine()
                    ->getRepository("ThesisBulletinBundle:College")
                    ->findAllSorted()
                ]
        ;
    }

    /**
     * @View()
     */
    public function getCollegeAction($id) {
        return [
            'college' => $this->getDoctrine()
                    ->getRepository("ThesisBulletinBundle:College")
                    ->find($id)
                ]
        ;
    }

}
