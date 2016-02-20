<?php

namespace Thesis\BulletinBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\ExecutionContextInterface;

/**
 * PlainAnnouncement
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="PlainAnnouncementRepository")
 */
class PlainAnnouncement extends Announcement {

    public function __construct() {
        $this->type = "plain";
    }

    /**
     * @var string
     *
     * @ORM\Column(name="content", type="text")
     */
    private $content;
    
    /**
     * @var string
     *
     * @ORM\Column(name="htmlContent", type="text")
     */
    private $htmlContent;

    /**
     * Set content
     *
     * @param string $content
     *
     * @return PlainAnnouncement
     */
    public function setContent($content) {
        $this->content = $content;

        return $this;
    }

    /**
     * Get content
     *
     * @return string
     */
    public function getContent() {
        return $this->content;
    }

    /**
     * @Assert\Callback
     */
    public function validate(ExecutionContextInterface $context) {
        if ($this->title === null || $this->content === null) {
            $context->addViolation("Please fill in all required(*) fields");
        }

        if ($this->title === null) {
            $context->addViolationAt('title', null);
        }
        if ($this->content === null) {
            $context->addViolationAt('content', null);
        }
    }


    /**
     * Set visible
     *
     * @param boolean $visible
     *
     * @return PlainAnnouncement
     */
    public function setVisible($visible)
    {
        $this->visible = $visible;

        return $this;
    }

    /**
     * Get visible
     *
     * @return boolean
     */
    public function getVisible()
    {
        return $this->visible;
    }

    /**
     * Set htmlContent
     *
     * @param string $htmlContent
     *
     * @return PlainAnnouncement
     */
    public function setHtmlContent($htmlContent)
    {
        $this->htmlContent = $htmlContent;

        return $this;
    }

    /**
     * Get htmlContent
     *
     * @return string
     */
    public function getHtmlContent()
    {
        return $this->htmlContent;
    }
}
