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
use Thesis\BulletinBundle\Entity\Department;
use Thesis\BulletinBundle\Form\DepartmentType;

/**
 * Department controller.
 *
 * @Route("/department")
 */
class DepartmentController extends Controller {

    /**
     * Lists all Department entities.
     *
     * @Route("/", name="department")
     * @Method("GET")
     * @Template()
     */
    public function indexAction() {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('ThesisBulletinBundle:Department')->findAll();

        return array(
            'entities' => $entities,
        );
    }

    /**
     * Creates a new Department entity.
     *
     * @Route("/", name="department_create", options={"expose"=true})
     * @Method("POST")
     */
    public function createAction(Request $request) {
        $entity = new Department();
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);


        if ($form->isValid()) {
            $id = $request->request->get('id');
            $em = $this->getDoctrine()->getManager();
            $col = $em->getRepository("ThesisBulletinBundle:College")->find($id);
            $entity->setCollege($col);
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
            $fields[] = 'class.name';
        }


        $response = ['valid' => false, 'errors' => $errors, 'fields' => $fields];
        $response = ['id' => $entity->getCollege()->getId()];


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
     * Creates a form to create a Department entity.
     *
     * @param Department $entity The entity
     *
     * @return Form The form
     */
    private function createCreateForm(Department $entity) {
        $form = $this->createForm(new DepartmentType(), $entity, array(
            'action' => $this->generateUrl('department_create'),
            'method' => 'POST',
        ));

        $form->add('submit', 'submit', array('label' => 'Create'));

        return $form;
    }

    /**
     * Displays a form to create a new Department entity.
     *
     * @Route("/new", name="department_new")
     * @Method("GET")
     * @Template()
     */
    public function newAction() {
        $entity = new Department();
        $form = $this->createCreateForm($entity);

        return array(
            'entity' => $entity,
            'form' => $form->createView(),
        );
    }

    /**
     * Finds and displays a Department entity.
     *
     * @Route("/{id}", name="department_show")
     * @Method("GET")
     * @Template()
     */
    public function showAction($id) {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('ThesisBulletinBundle:Department')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Department entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity' => $entity,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing Department entity.
     *
     * @Route("/edit", name="department_update", options={"expose"=true})
     * @Method("POST")
     */
    public function updateAction(Request $request) {
        $em = $this->getDoctrine()->getManager();
        $id = $request->request->get('id');

        $entity = $em->getRepository('ThesisBulletinBundle:Department')->find($id);
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);


        if ($form->isValid()) {
            $collegeId = $request->request->get('college_id');

            $col = $em->getRepository("ThesisBulletinBundle:College")->find($collegeId);
            $entity->setCollege($col);
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
            $fields[] = 'class.name';
        }


        $response = ['valid' => false, 'errors' => $errors, 'fields' => $fields];
        $response = ['id' => $entity->getCollege()->getId()];


        return new JsonResponse($response);
    }

    /**
     * @Method("POST")
     * @Route("/delete", name="department_delete", options={"expose"=true})
     */

    /**
     * @Method("POST")
     * @Route("/delete", name="department_delete", options={"expose"=true})
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
                ->getRepository('ThesisBulletinBundle:Department')
                ->find($id);

        if (count($target->getFaculty()) > 0) {
            return new JsonResponse(['match' => false]);
        }

        $match = $encoded_pass == $user->getPassword();

        if ($match) {
            
            $em->persist($target);
            $em->remove($target);
            $em->flush();
        }
        return new JsonResponse(['match' => $match]);
    }

    /**
     * @View()
     */
    public function getDepartmentsAction() {
        return [
            'departments' => $this->getDoctrine()
                    ->getRepository("ThesisBulletinBundle:Department")
                    ->findAllSorted()
                ]
        ;
    }

    /**
     * @View()
     */
    public function getDepartmentAction($id) {
        return [
            'department' => $this->getDoctrine()
                    ->getRepository("ThesisBulletinBundle:Department")
                    ->find($id)
                ]
        ;
    }

}
