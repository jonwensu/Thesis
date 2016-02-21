<?php

namespace Thesis\BulletinBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\OneToOne;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\ExecutionContextInterface;
use JMS\Serializer\Annotation\Groups;

/**
 * ImageAnnouncement
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="ImageAnnouncementRepository")
 */
class ImageAnnouncement extends Announcement {

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", nullable=true)
     * @Groups({"search"})
     */
    private $description;
    
      /**
     * @OneToOne(targetEntity="Document")
     * @JoinColumn(name="document_id", referencedColumnName="id")
     */
    private $document;
    
    /**
     * Set description
     *
     * @param string $description
     *
     * @return ImageAnnouncement
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
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
     * Set visible
     *
     * @param boolean $visible
     *
     * @return ImageAnnouncement
     */
    public function setVisible($visible)
    {
        $this->visible = $visible;

        return $this;
    }

    /**
     * Get visible
     *
     * @return boolean
     */
    public function getVisible()
    {
        return $this->visible;
    }

    /**
     * Set document
     *
     * @param \Thesis\BulletinBundle\Entity\Document $document
     *
     * @return ImageAnnouncement
     */
    public function setDocument(\Thesis\BulletinBundle\Entity\Document $document = null)
    {
        $this->document = $document;

        return $this;
    }

    /**
     * Get document
     *
     * @return \Thesis\BulletinBundle\Entity\Document
     */
    public function getDocument()
    {
        return $this->document;
    }
}
