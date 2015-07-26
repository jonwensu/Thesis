<?php

namespace Thesis\BulletinBundle\Controller;

use FOS\RestBundle\Controller\Annotations\View;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;


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
    public function getUserAction($id) {
        return [
            'user' => $this->getDoctrine()
                ->getManager()
                ->getRepository('ThesisBulletinBundle:User')
                ->find($id)
        ];
    }

}
