<?php

namespace Thesis\BulletinBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\DiscriminatorMap;
use Doctrine\ORM\Mapping\DiscriminatorColumn;
use Doctrine\ORM\Mapping\InheritanceType;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\ExecutionContextInterface;
use JMS\Serializer\Annotation\Groups;

/**
 * Announcement
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="AnnouncementRepository")
 * @InheritanceType("SINGLE_TABLE")
 * @DiscriminatorColumn(name="type", type="string")
 * @DiscriminatorMap({"image" = "ImageAnnouncement", "plain" = "PlainAnnouncement"})
 */
abstract class Announcement {

    public function __construct() {
        
    }

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Groups({"search"})
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
     * @Groups({"search"})
     */
    protected $title;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="datePosted", type="datetime")
     * @Groups({"search"})
     */
    protected $datePosted;

    /**
     * @var boolean
     *
     * @ORM\Column(name="visible", type="boolean")
     */
    protected $visible;

    /**
     * @var integer
     *
     * @ORM\Column(name="priorityLvl", type="integer")
     * @Groups({"search"})
     */
    protected $priorityLvl;

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
        if ($this->title === null) {
            $context->addViolation("Please fill in all required(*) fields");
        }

        if ($this->title === null) {
            $context->addViolationAt('title', null);
        }
    }

    /**
     * Set board
     *
     * @param \Thesis\BulletinBundle\Entity\Board $board
     *
     * @return Announcement
     */
    public function setBoard(\Thesis\BulletinBundle\Entity\Board $board = null) {
        $this->board = $board;

        if (!$board->getAnnouncements()->contains($this)) {
            $board->addAnnouncement($this);
        }

        return $this;
    }

    /**
     * Get board
     *
     * @return \Thesis\BulletinBundle\Entity\Board
     */
    public function getBoard() {
        return $this->board;
    }

    /**
     * Set priorityLvl
     *
     * @param integer $priorityLvl
     *
     * @return Announcement
     */
    public function setPriorityLvl($priorityLvl) {
        $this->priorityLvl = $priorityLvl;

        return $this;
    }

    /**
     * Get priorityLvl
     *
     * @return integer
     */
    public function getPriorityLvl() {
        return $this->priorityLvl;
    }

    /**
     * Set visible
     *
     * @param boolean $visible
     *
     * @return Announcement
     */
    public function setVisible($visible) {
        $this->visible = $visible;

        return $this;
    }

    /**
     * Get visible
     *
     * @return boolean
     */
    public function getVisible() {
        return $this->visible;
    }

}
