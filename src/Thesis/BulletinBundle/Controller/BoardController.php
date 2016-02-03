<?php

namespace Thesis\BulletinBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * @Route("/public")
 */
class BoardController extends Controller {

    /**
     * @Route("/", name="board_view", options={"expose"=true})
     * @Template("ThesisBulletinBundle:Default:public.html.twig")
     */
    public function viewAction() {
        return array(
                // ...
        );
    }
    
    /**
     * @Route("/map", name="map_view", options={"expose"=true})
     * @Template("ThesisBulletinBundle:Default:map.html.twig")
     */
    public function showMapAction() {
        return array(
        );
    }

    /**
     * @Route("/edit")
     * @Template()
     */
    public function editAction() {
        return array(
                // ...
        );
    }

}
