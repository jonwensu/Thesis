<?php

namespace Thesis\BulletinBundle\Controller;

use FOS\RestBundle\Controller\Annotations\View;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\FormErrorIterator;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends Controller {

    /**
     * @View()
     */
    public function getUsersAction() {

        return [
            'users' => $this->getDoctrine()
                    ->getManager()
                    ->getRepository('ThesisBulletinBundle:User')
                    ->findAll()
        ];
    }

    /**
     * @View()
     */
    public function getUsersOtherAction() {

        return [
            'users' => $this->getDoctrine()
                    ->getManager()
                    ->getRepository('ThesisBulletinBundle:User')
                    ->findAdmins()
        ];
    }

    private function getCurrentUser() {
        if ($this->getUser() == null) {
            return null;
        }
        $user = clone $this->getUser();
        $user->addRole("ROLE_OWNER");
        return $user;
    }

    /**
     * @View(serializerGroups={"authentication"})
     */
    public function getUserCurrentAction() {
        if ($this->getUser() == null) {
            return null;
        }
        
        return $this->getUser();
    }

    /**
     * @View()
     */
    public function getUserAction($id) {
        return [
            'user' => $this->getDoctrine()
                    ->getManager()
                    ->getRepository('ThesisBulletinBundle:User')
                    ->find($id)
        ];
    }

    /**
     * @View(serializerGroups={"edit"})
     */
    public function getUserEditAction($id) {
        return $this->getUserAction($id);
    }

    /**
     * @Method("POST")
     * @Route("/authorized", name="is_authorized", options={"expose"=true})
     */
    public function isAuthorized(Request $request) {
        $required = $request->request->get('roles');
        $id = $request->request->get('id');
        $roles = $this->getCurrentUser()->getRoles();

        return new JsonResponse(['authorized' => $this->hasRole($required, $roles) && $this->getUser()->getId() == $id]);
    }

    /**
     * @Method("GET")
     * @Route("/authenticated", name="is_authenticated", options={"expose"=true})
     */
    public function isAuthenticated(Request $request) {
        $result = false;
        if ($this->getUser()) {
            $result = true;
        }
        return new JsonResponse(['authenticated' => $this->getUser() != null]);
    }

    private function hasRole($needles, $haystack) {
        foreach ($needles as $i) {
            if (in_array("ROLE_" . $i, $haystack)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @Method("POST")
     * @Route("/password_match", name="password_match", options={"expose"=true})
     */
    public function checkPasswordAction(Request $request) {
        $password = $request->request->get('password');
        $id = $request->request->get('id');
        /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
        $userManager = $this->get('fos_user.user_manager');
        $user = $this->getUser();
        $encoder_service = $this->get('security.encoder_factory');
        $encoder = $encoder_service->getEncoder($user);
        $encoded_pass = $encoder->encodePassword($password, $user->getSalt());

        $match = $encoded_pass == $user->getPassword();

        if ($match) {
            $target = $this->getDoctrine()
                    ->getManager()
                    ->getRepository('ThesisBulletinBundle:User')
                    ->find($id);
            $enabled = $target->isEnabled();
            $target->setEnabled(!$enabled);
            $userManager->updateUser($target);
            return new JsonResponse(['match' => $match, 'enabled' => !$enabled]);
        }
        return new JsonResponse(['match' => $match]);
    }

    /**
     * @Method("POST")
     * @Route("/user/edit", name="user_edit", options={"expose"=true})
     */
    public function editAction(Request $request) {

        $id = $request->request->get('id');
        $user = $this->getDoctrine()
                ->getManager()
                ->getRepository("ThesisBulletinBundle:User")
                ->find($id);

        /** @var $formFactory \FOS\UserBundle\Form\Factory\FactoryInterface */
        $formFactory = $this->get('fos_user.profile.form.factory');

        $form = $formFactory->createForm();
        $form->setData($user);

        $form->handleRequest($request);
        if ($this->getUser()->getId() == $id || in_array("ROLE_SUPER_ADMIN", $this->getUser()->getRoles())) {
            if ($form->isValid()) {
                /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
                $userManager = $this->get('fos_user.user_manager');
                $userManager->updateUser($user);
                return new JsonResponse(['valid' => true]);
            }
        } else {
            return new JsonResponse(['valid' => false, 'authorized' => false]);
        }

        $e = $form['email']->getErrors(true);
        $u = $form['username']->getErrors(true);
        $emailErrors = $this->getErrorMsgs($e);
        $usernameErrors = $this->getErrorMsgs($u);
        $formErrors = $this->getErrorMsgs($form->getErrors(true));
        $errors = array_unique(array_merge([$emailErrors, $usernameErrors, $formErrors]), SORT_REGULAR);
        $fields = [];

        if ($e->count() > 0) {
            $fields[] = 'email';
        }

        if ($u->count() > 0) {
            $fields[] = 'username';
        }

        return new JsonResponse(['valid' => false, 'authorized' => true, 'errors' => $errors, 'fields' => $fields]);
    }

    private function getErrorMsgs(FormErrorIterator $errors) {
        $e = [];
        foreach ($errors as $error) {
            $e[] = $errors->current()->getMessage();
            $errors->next();
        }
        return $e;
    }

}
