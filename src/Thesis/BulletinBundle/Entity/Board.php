<?php

namespace Thesis\BulletinBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\Mapping as ORM;

/**
 * Board
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="BoardRepository")
 */
class Board {

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * Get id
     *
     * @return integer
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @ORM\OneToMany(targetEntity="Announcement", mappedBy="board")
     */
    private $announcements;

    /**
     * Constructor
     */
    public function __construct() {
        $this->announcements = new ArrayCollection();
    }

    /**
     * Add announcement
     *
     * @param Announcement $announcement
     *
     * @return Board
     */
    public function addAnnouncement(Announcement $announcement) {
        $this->announcements[] = $announcement;

        if ($announcement->getBoard() != $this) {
            $announcement->setBoard($this);
        }

        return $this;
    }

    /**
     * Remove announcement
     *
     * @param Announcement $announcement
     */
    public function removeAnnouncement(Announcement $announcement) {
        $this->announcements->removeElement($announcement);
    }

    /**
     * Get announcements
     *
     * @return Collection
     */
    public function getAnnouncements() {
        $criteria = Criteria::create()
                ->orderBy(["priorityLvl" => Criteria::ASC, "datePosted" => Criteria::DESC, "title" => Criteria::ASC])
        ;
        return $this->announcements->matching($criteria);
    }

    public function getVisibleAnnouncements() {
        $criteria = Criteria::create()
                ->where(Criteria::expr()->eq("visible", true))
                ->orderBy(["priorityLvl" => Criteria::ASC, "datePosted" => Criteria::DESC, "title" => Criteria::ASC])
        ;
        
        return $this->announcements->matching($criteria);
    }

}
