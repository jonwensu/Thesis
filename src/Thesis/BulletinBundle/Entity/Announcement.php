<?php

namespace Thesis\BulletinBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\DiscriminatorColumn;
use Doctrine\ORM\Mapping\DiscriminatorMap;
use Doctrine\ORM\Mapping\InheritanceType;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use JMS\Serializer\Annotation\Groups;
use JMS\Serializer\Annotation\SerializedName;
use JMS\Serializer\Annotation\VirtualProperty;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\ExecutionContextInterface;

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
     * @Groups({"search"})
     */
    protected $visible;

    /**
     * @var integer
     *
     * @ORM\Column(name="priorityLvl", type="integer")
     * @Groups({"search", "ticker"})
     */
    protected $priorityLvl;

    /**
     * @var integer
     *
     * @ORM\Column(name="pinned", type="boolean")
     * @Groups({"ticker", "search"})
     */
    protected $pinned;

    /**
     * @var integer
     *
     * @ORM\Column(name="pinnedContent", type="text", nullable=true)
     * @SerializedName("pcontent")
     * @Groups({"ticker", "search"})
     */
    protected $pinnedContent;

    /**
     * Get id
     *
     * @return integer
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @ManyToOne(targetEntity="User", inversedBy="announcements")
     * @JoinColumn(name="user_id", referencedColumnName="id")
     */
    private $encoder;

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

        if ($this->pinned && $this->pinnedContent === null) {
            $context->addViolation('pinnedContent', "This announcement has been pinned. Please enter the content to show on the ticker.");
        }
    }

    /**
     * Set board
     *
     * @param Board $board
     *
     * @return Announcement
     */
    public function setBoard(Board $board = null) {
        $this->board = $board;

        if (!$board->getAnnouncements()->contains($this)) {
            $board->addAnnouncement($this);
        }

        return $this;
    }

    /**
     * Get board
     *
     * @return Board
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

    /**
     * @VirtualProperty
     * @SerializedName("formatted_date")
     * @Groups({"search"})
     */
    public function formattedDate() {
        return $this->datePosted->format("F j, Y");
    }

    /**
     * @VirtualProperty
     * @SerializedName("encoder_name")
     * @Groups({"search"})
     */
    public function getEncoderName() {
        return $this->encoder->getFullName();
    }

    /**
     * Set encoder
     *
     * @param \Thesis\BulletinBundle\Entity\User $encoder
     *
     * @return Announcement
     */
    public function setEncoder(\Thesis\BulletinBundle\Entity\User $encoder = null) {
        $this->encoder = $encoder;

        return $this;
    }

    /**
     * Get encoder
     *
     * @return \Thesis\BulletinBundle\Entity\User
     */
    public function getEncoder() {
        return $this->encoder;
    }

    /**
     * Set pinned
     *
     * @param boolean $pinned
     *
     * @return Announcement
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
     * @return Announcement
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
