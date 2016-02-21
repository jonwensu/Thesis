<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Thesis\BulletinBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Thesis\BulletinBundle\Entity\Document;

/**
 * Description of DocumentController
 *
 * @author wenszxc
 */
class DocumentController extends Controller {

    /**
     * @Route("/upload_process", name="upload", options={"expose"=true})
     * @Method("POST")
     */
    public function uploadAction(Request $request) {

        if ($request->isXmlHttpRequest()) {
            $files = $request->files;
            $em = $this->getDoctrine()->getManager();

            $ids = [];

            foreach ($files as $file) {
                $document = new Document();
                $document->setFile($file);
                $em->persist($document);
                $ids[] = $document;
            }
            $em->flush();

            return new JsonResponse(['id' => $ids[0]->getId()]);
        }
    }

    /**
     * @Route("/upload_image", name="upload_image", options={"expose"=true})
     * @Method("POST")
     */
    public function uploadImageAction(Request $request) {
        if ($request->isXmlHttpRequest()) {
            $files = $request->files;
            $id = $request->request->get('id');
            $em = $this->getDoctrine()->getManager();
            $announcement = $em->getRepository("ThesisBulletinBundle:ImageAnnouncement")->find($id);
            $ids = [];

            foreach ($files as $file) {
                $document = new Document();
                $document->setFile($file);
                $em->persist($document);
                $ids[] = $document;
            }
            $announcement->setDocument($ids[0]);
            $em->persist($announcement);
            $em->flush();

            return new JsonResponse(['id' => $ids[0]->getId()]);
        }
    }

}
