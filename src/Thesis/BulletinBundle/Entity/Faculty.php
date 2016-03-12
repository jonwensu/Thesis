<?php

namespace Thesis\BulletinBundle\Entity;

use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\JoinTable;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\OneToOne;
use JMS\Serializer\Annotation\Groups;
use JMS\Serializer\Annotation\SerializedName;
use JMS\Serializer\Annotation\VirtualProperty;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\ExecutionContextInterface;

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
     * @Groups({"search"})
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="firstName", type="string", length=255)
     * @Groups({"search"})
     */
    private $firstName;

    /**
     * @var string
     *
     * @ORM\Column(name="lastName", type="string", length=255)
     * @Groups({"search"})
     */
    private $lastName;


    /**
     * @var string
     *
     * @ORM\Column(name="office", type="string", length=255, nullable=true)
     */
    private $office;

    /**
     * @var string
     *
     * @ORM\Column(name="email", type="string", length=255, nullable=true)
     * @Assert\Email(message="Please enter a valid email")
     */
    private $email;

    /**
     * @ManyToOne(targetEntity="Department", inversedBy="faculty")
     * @JoinTable(name="department_id")
     */
    private $department;

    /**
     * @OneToOne(targetEntity="Document")
     * @JoinColumn(name="picture_id", referencedColumnName="id")
     */
    private $picture;

    /**
     * @VirtualProperty
     * @SerializedName("department")
     * @Groups({"search"})
     */
    public function getDepartmentName() {
        return $this->department->getName();
    }

    /**
     * @VirtualProperty
     * @SerializedName("college")
     * @Groups({"search"})
     */
    public function getCollegeName() {
        return $this->department->getCollege()->getName();
    }

    /**
     * @VirtualProperty
     * @SerializedName("picture")
     * @Groups({"search"})
     */
    public function getPicturePath() {
        if ($this->picture) {
            return $this->picture->getWebPath();
        }
        return null;
    }

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
     * Set office
     *
     * @param string $office
     *
     * @return Faculty
     */
    public function setOffice($office) {
        $this->office = $office;

        return $this;
    }

    /**
     * Get office
     *
     * @return string
     */
    public function getOffice() {
        return $this->office;
    }

    /**
     * Set email
     *
     * @param string $email
     *
     * @return Faculty
     */
    public function setEmail($email) {
        $this->email = $email;

        return $this;
    }

    /**
     * Get email
     *
     * @return string
     */
    public function getEmail() {
        return $this->email;
    }

    /**
     * Set department
     *
     * @param Department $department
     *
     * @return Faculty
     */
    public function setDepartment(Department $department = null) {
        $this->department = $department;

        if (!$department->getFaculty()->contains($this)) {
            $department->addFaculty($this);
        }

        return $this;
    }

    /**
     * Get department
     *
     * @return Department
     */
    public function getDepartment() {
        return $this->department;
    }

    /**
     * @Assert\Callback
     */
    public function validate(ExecutionContextInterface $context) {
        if ($this->firstName === null || $this->lastName === null) {
            $context->addViolation("Please fill in all required(*) fields");
        }

        if ($this->firstName === null) {
            $context->addViolationAt('firstName', null);
        }

        if ($this->lastName === null) {
            $context->addViolationAt('lastName', null);
        }
    }
    
    /**
     * Set picture
     *
     * @param Document $picture
     *
     * @return Faculty
     */
    public function setPicture(Document $picture = null) {
        $this->picture = $picture;

        return $this;
    }

    /**
     * Get picture
     *
     * @return Document
     */
    public function getPicture() {
        return $this->picture;
    }

}
