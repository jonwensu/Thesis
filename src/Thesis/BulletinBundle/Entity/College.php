<?php

namespace Thesis\BulletinBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\OneToMany;

/**
 * College
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="CollegeRepository")
 */
class College
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
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;
    
     /**
     * @OneToMany(targetEntity="Department", mappedBy="college")
     */
    private $departments;


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
     * Set name
     *
     * @param string $name
     *
     * @return College
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->departments = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add department
     *
     * @param \Thesis\BulletinBundle\Entity\Department $department
     *
     * @return College
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
