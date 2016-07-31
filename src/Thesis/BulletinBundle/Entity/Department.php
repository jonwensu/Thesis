<?php

namespace Thesis\BulletinBundle\Entity;

use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToMany;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\OneToMany;

/**
 * Department
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="DepartmentRepository")
 */
class Department {

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
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @OneToMany(targetEntity="Faculty", mappedBy="department")
     */
    private $faculty;

    /**
     * @ManyToOne(targetEntity="College", inversedBy="department")
     * @JoinColumn(name="college_id", referencedColumnName="id")
     */
    private $college;

    /**
     * Get id
     *
     * @return integer
     */
    public function getId() {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Department
     */
    public function setName($name) {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName() {
        return $this->name;
    }

    /**
     * Constructor
     */
    public function __construct() {
        
    }

    /**
     * Set college
     *
     * @param College $college
     *
     * @return Department
     */
    public function setCollege(College $college = null) {
        $this->college = $college;

        return $this;
    }

    /**
     * Get college
     *
     * @return College
     */
    public function getCollege() {
        return $this->college;
    }

    /**
     * Add faculty
     *
     * @param \Thesis\BulletinBundle\Entity\Faculty $faculty
     *
     * @return Department
     */
    public function addFaculty(\Thesis\BulletinBundle\Entity\Faculty $faculty) {
        $this->faculty[] = $faculty;

        if ($faculty->getDepartment() !== $this) {
            $faculty->setDepartment($this);
        }

        return $this;
    }

    /**
     * Remove faculty
     *
     * @param \Thesis\BulletinBundle\Entity\Faculty $faculty
     */
    public function removeFaculty(\Thesis\BulletinBundle\Entity\Faculty $faculty) {
        $this->faculty->removeElement($faculty);
        $faculty->setDepartment(null);
    }

    /**
     * Get faculty
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getFaculty() {
        return $this->faculty;
    }

}
