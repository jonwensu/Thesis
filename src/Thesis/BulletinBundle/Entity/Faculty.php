<?php

namespace Thesis\BulletinBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\JoinTable;
use Doctrine\ORM\Mapping\ManyToMany;
use Doctrine\ORM\Mapping\OneToMany;

/**
 * Faculty
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="FacultyRepository")
 */
class Faculty {

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="firstName", type="string", length=255)
     */
    private $firstName;

    /**
     * @var string
     *
     * @ORM\Column(name="lastName", type="string", length=255)
     */
    private $lastName;

    /**
     * @ManyToMany(targetEntity="Department", inversedBy="faculty")
     * @JoinTable(name="faculty_departments")
     */
    private $departments;

    /**
     * Get id
     *
     * @return integer
     */
    public function getId() {
        return $this->id;
    }

    /**
     * Set firstName
     *
     * @param string $firstName
     *
     * @return Faculty
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
     * @return Faculty
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
     * Constructor
     */
    public function __construct() {
        
    }


    /**
     * Add department
     *
     * @param \Thesis\BulletinBundle\Entity\Department $department
     *
     * @return Faculty
     */
    public function addDepartment(\Thesis\BulletinBundle\Entity\Department $department)
    {
        $this->departments[] = $department;

        return $this;
    }

    /**
     * Remove department
     *
     * @param \Thesis\BulletinBundle\Entity\Department $department
     */
    public function removeDepartment(\Thesis\BulletinBundle\Entity\Department $department)
    {
        $this->departments->removeElement($department);
    }

    /**
     * Get departments
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getDepartments()
    {
        return $this->departments;
    }
}
