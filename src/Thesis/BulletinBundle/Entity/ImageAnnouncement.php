<?php

namespace Thesis\BulletinBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\ExecutionContextInterface;

/**
 * ImageAnnouncement
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="ImageAnnouncementRepository")
 */
class ImageAnnouncement extends Announcement {
    
    public function __construct() {
        $this->type = "image";
    }

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", nullable=true)
     */
    private $description;
    
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
}
