<?php

namespace Thesis\BulletinBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\OneToMany;
use FOS\UserBundle\Model\User as BaseUser;
use JMS\Serializer\Annotation\ExclusionPolicy;
use JMS\Serializer\Annotation\Expose;
use JMS\Serializer\Annotation\Groups;
use JMS\Serializer\Annotation\SerializedName;
use JMS\Serializer\Annotation\VirtualProperty;

/**
 * @ORM\Entity
 * @ORM\Table(name="fos_user")
 * @ORM\Entity(repositoryClass="UserRepository")
 * @ExclusionPolicy("all")
 */
class User extends BaseUser {

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Expose()
     * @Groups({"authentication"})
     */
    protected $id;

    /**
     * @var string
     * @Expose()
     * @Groups({"authentication"})
     * @ORM\Column(name="firstName", type="string", length=255)
     */
    private $firstName;

    /**
     * @var string
     * @Expose()
     * @Groups({"authentication"})
     * @ORM\Column(name="lastName", type="string", length=255)
     */
    private $lastName;

    public function __construct() {
        parent::__construct();
        // your own logic
    }

    public function __toString() {
        return $this->firstName . ' ' . $this->lastName;
    }

    /**
     * @OneToMany(targetEntity="Announcement", mappedBy="encoder")
     */
    private $announcements;

    /**
     * Set firstName
     *
     * @param string $firstName
     *
     * @return User
     */
    public function setFirstName($firstName) {
        $this->firstName = $firstName;

        return $this;
    }

    /**
     * Get firstName
     *
     * @return string
     */
    public function getFirstName() {
        return $this->firstName;
    }

    /**
     * Set lastName
     *
     * @param string $lastName
     *
     * @return User
     */
    public function setLastName($lastName) {
        $this->lastName = $lastName;

        return $this;
    }

    /**
     * Get lastName
     *
     * @return string
     */
    public function getLastName() {
        return $this->lastName;
    }

    /**
     * Add announcement
     *
     * @param \Thesis\BulletinBundle\Entity\Announcement $announcement
     *
     * @return User
     */
    public function addAnnouncement(\Thesis\BulletinBundle\Entity\Announcement $announcement) {
        $this->announcements[] = $announcement;

        return $this;
    }

    /**
     * Remove announcement
     *
     * @param \Thesis\BulletinBundle\Entity\Announcement $announcement
     */
    public function removeAnnouncement(\Thesis\BulletinBundle\Entity\Announcement $announcement) {
        $this->announcements->removeElement($announcement);
    }

    /**
     * Get announcements
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getAnnouncements() {
        return $this->announcements;
    }

    /**
     * @VirtualProperty
     * @SerializedName("full_name")
     */
    public function getFullName() {
        return $this->firstName . ' ' . $this->lastName;
    }

}
