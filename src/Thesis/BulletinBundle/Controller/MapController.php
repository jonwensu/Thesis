<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Thesis\BulletinBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Description of MapController
 *
 * @author wenszxc
 */
class MapController extends Controller {

    /**
     * @Route("/public/map", name="map_view", options={"expose"=true})
     * @Template()
     */
    public function showAction() {
        return array(
        );
    }

}
