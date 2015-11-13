<?php

namespace Thesis\BulletinBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;

class DefaultController extends Controller
{
    /**
     * @Route("", name="home", options={"expose"=true})
     * @Template()
     * @Security( "has_role( 'ROLE_ADMIN' )" )
     */
    function indexAction() {
        return [];
    }
}
