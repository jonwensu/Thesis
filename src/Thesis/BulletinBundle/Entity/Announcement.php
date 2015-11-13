<?php

namespace Thesis\BulletinBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\ExecutionContextInterface;

/**
 * Announcement
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="AnnouncementRepository")
 */
class Announcement {

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="Board", inversedBy="announcements")
     * @ORM\JoinColumn(name="board_id", referencedColumnName="id")
     */
    private $board;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="content", type="text")
     */
    private $content;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="datePosted", type="datetime")
     */
    private $datePosted;

    /**
     * Get id
     *
     * @return integer
     */
    public function getId() {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     *
     * @return Announcement
     */
    public function setTitle($title) {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle() {
        return $this->title;
    }

    /**
     * Set content
     *
     * @param string $content
     *
     * @return Announcement
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
     * Set datePosted
     *
     * @param \DateTime $datePosted
     *
     * @return Announcement
     */
    public function setDatePosted($datePosted) {
        $this->datePosted = $datePosted;

        return $this;
    }

    /**
     * Get datePosted
     *
     * @return \DateTime
     */
    public function getDatePosted() {
        return $this->datePosted;
    }

    /**
     * @Assert\Callback
     */
    public function validate(ExecutionContextInterface $context) {
        $blank = false;
        if ($this->title === null ||
                $this->content === null) {
            $context->addViolation("Please fill in all fields");
        }

        if ($this->title === null) {
            $context->addViolationAt('title', null);
        }

        if ($this->content === null) {
            $context->addViolationAt('content', null);
        }
    }


    /**
     * Set board
     *
     * @param \Thesis\BulletinBundle\Entity\Board $board
     *
     * @return Announcement
     */
    public function setBoard(\Thesis\BulletinBundle\Entity\Board $board = null)
    {
        $this->board = $board;

        return $this;
    }

    /**
     * Get board
     *
     * @return \Thesis\BulletinBundle\Entity\Board
     */
    public function getBoard()
    {
        return $this->board;
    }
}
