<?php

namespace Thesis\BulletinBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class BoardController extends Controller {

    /**
     * @Route("/public/", name="board_view", options={"expose"=true})
     * @Template("ThesisBulletinBundle:Default:public.html.twig")
     */
    public function viewAction() {
        return array(
                // ...
        );
    }
    
    /**
     * @Route("/preview/", name="board_preview", options={"expose"=true})
     * @Template("ThesisBulletinBundle:Default:preview.html.twig")
     */
    public function previewAction() {
        return array(
                // ...
        );
    }
}
