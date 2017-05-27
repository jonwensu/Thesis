<?php

namespace Thesis\BulletinBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\ExecutionContextInterface;
use JMS\Serializer\Annotation\Groups;

/**
 * PlainAnnouncement
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="PlainAnnouncementRepository")
 */
class PlainAnnouncement extends Announcement {

    /**
     * @var string
     *
     * @ORM\Column(name="content", type="text")
     * @Groups({"search"})
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

        if ($this->pinned && $this->pinnedContent === null) {
            $context->addViolation('pinnedContent', "This announcement has been pinned. Please enter the content to show on the ticker.");
        }
    }

    /**
     * Set htmlContent
     *
     * @param string $htmlContent
     *
     * @return PlainAnnouncement
     */
    public function setHtmlContent($htmlContent) {
        $this->htmlContent = $htmlContent;

        return $this;
    }

    /**
     * Get htmlContent
     *
     * @return string
     */
    public function getHtmlContent() {
        return $this->htmlContent;
    }

    /**
     * Set pinned
     *
     * @param boolean $pinned
     *
     * @return PlainAnnouncement
     */
    public function setPinned($pinned) {
        $this->pinned = $pinned;

        return $this;
    }

    /**
     * Get pinned
     *
     * @return boolean
     */
    public function getPinned() {
        return $this->pinned;
    }

    /**
     * Set pinnedContent
     *
     * @param string $pinnedContent
     *
     * @return PlainAnnouncement
     */
    public function setPinnedContent($pinnedContent) {
        $this->pinnedContent = $pinnedContent;

        return $this;
    }

    /**
     * Get pinnedContent
     *
     * @return string
     */
    public function getPinnedContent() {
        return $this->pinnedContent;
    }

}
