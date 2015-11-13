<?php

namespace Thesis\BulletinBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Board
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="Thesis\BulletinBundle\Entity\BoardRepository")
 */
class Board
{
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
    public function getId()
    {
        return $this->id;
    }
    
    /**
     * @ORM\OneToMany(targetEntity="Announcement", mappedBy="board")
     */
    private $announcements;
    
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->announcements = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add announcement
     *
     * @param \Thesis\BulletinBundle\Entity\Announcement $announcement
     *
     * @return Board
     */
    public function addAnnouncement(\Thesis\BulletinBundle\Entity\Announcement $announcement)
    {
        $this->announcements[] = $announcement;

        return $this;
    }

    /**
     * Remove announcement
     *
     * @param \Thesis\BulletinBundle\Entity\Announcement $announcement
     */
    public function removeAnnouncement(\Thesis\BulletinBundle\Entity\Announcement $announcement)
    {
        $this->announcements->removeElement($announcement);
    }

    /**
     * Get announcements
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getAnnouncements()
    {
        return $this->announcements;
    }
}
