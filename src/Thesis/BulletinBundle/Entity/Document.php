<?php

namespace Thesis\BulletinBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use JMS\Serializer\Annotation\VirtualProperty;
use JMS\Serializer\Annotation\SerializedName;


/**
 * Document
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="DocumentRepository")
 * @ORM\HasLifecycleCallbacks
 */
class Document {

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
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(name="type", type="string", length=255)
     */
    private $type;

    /**
     * @ORM\Column(name="extension", type="string", length=255)
     */
    private $extension;

    /**
     * @var \DateTime
     * @ORM\Column(name="dateUploaded", type="datetime")
     */
    private $dateUploaded;

    /**
     * @ORM\Column(name="path", type="string", length=255, nullable=true)
     */
    private $path;

    public function getAbsolutePath() {
        return null === $this->path ? null : $this->getUploadRootDir() . '/' . $this->path;
    }

    /**
     * @VirtualProperty
     * @SerializedName("wpath")
     */
    public function getWebPath() {
        return null === $this->path ? null : $this->getUploadDir() . '/' . $this->path;
    }
    
     /**
     * @VirtualProperty
     * @SerializedName("size")
     */
    public function getSize(){
        return filesize($this->getAbsolutePath());
    }

    protected function getUploadRootDir() {
        // the absolute directory path where uploaded
        // documents should be saved
        return __DIR__ . '/../../../../web/' . $this->getUploadDir();
    }

    protected function getUploadDir() {
        // get rid of the __DIR__ so it doesn't screw up
        // when displaying uploaded doc/image in the view.
        return 'uploads/' . $this->getFolder();
    }

    private $temp;
    private $file;

    /**
     * Sets file.
     *
     * @param UploadedFile $file
     */
    public function setFile(UploadedFile $file = null) {
        $this->file = $file;
        // check if we have an old image path
        if (isset($this->path)) {
            // store the old name to delete after the update
            $this->temp = $this->path;
            $this->path = null;
        } else {
            $this->path = 'initial';
        }
        return $this;
    }

    /**
     * Get file.
     *
     * @return UploadedFile
     */
    public function getFile() {
        return $this->file;
    }

    /**
     * @ORM\PrePersist()
     * @ORM\PreUpdate()
     */
    public function preUpload() {
        if (null !== $this->getFile()) {
            // do whatever you want to generate a unique name
            date_default_timezone_set('Asia/Manila');
            $date = new \DateTime('now');
            $this->dateUploaded = $date;
            $filename = preg_replace('/\\.[^.\\s]{3,4}$/', '', $this->getFile()->getClientOriginalName());
            $this->name = ucwords(strtolower($filename));
            $filename = sha1(uniqid(mt_rand(), true));
            $ext = $this->guessExtension();
            $this->extension = $ext;
            $this->path = $filename . '.' . $ext;
            $this->type = $this->guessType();
        }
    }

    private function guessType() {

        if ($this->isImage()) {
            return "image";
        } elseif ($this->isVideo()) {
            return "video";
        } elseif ($this->isAudio()) {
            return "audio";
        } elseif ($this->isDocument()) {
            return "document";
        } elseif ($this->isArchive()) {
            return "archive";
        } elseif ($this->extension === "dwg") {
            return "blueprint";
        } else {
            return "others";
        }
    }

    public function getDownloadFileName() {
        $name = strtolower($this->name);
        $name = preg_replace("([^\w\s\d\-_~,;:\[\]\(\).])", '', $name);
        $name = preg_replace("([\.]{2,})", '', $name);
        $name = preg_replace("[ ]", "_", $name);
        return $name . '.' . $this->extension;
    }

    public function guessExtension() {
        $extension = $this->getFile()->guessExtension();
        if ($extension === 'bin') {
            $exts = split("[/\\.]", strtolower($this->getFile()->getClientOriginalName()));
            $n = count($exts) - 1;
            $extension = strtolower($exts[$n]);
        } elseif ($extension === 'mpga') {
            $extension = 'mp3';
        }

        return $extension;
    }

    /**
     * @ORM\PostPersist()
     * @ORM\PostUpdate()
     */
    public function upload() {
        if (null === $this->getFile()) {
            return;
        }

        // if there is an error when moving the file, an exception will
        // be automatically thrown by move(). This will properly prevent
        // the entity from being persisted to the database on error
        $this->getFile()->move($this->getUploadRootDir() . '/', $this->path);

        // check if we have an old image
        if (isset($this->temp)) {
            // delete the old image
            unlink($this->getUploadRootDir() . '/' . $this->temp);
            // clear the temp image path
            $this->temp = null;
        }
        $this->file = null;
    }

  
    public function removeUpload() {
        $file = $this->getAbsolutePath();
        if ($file) {
            unlink($file);
        }
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Document
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
     * Set path
     *
     * @param string $path
     * @return Document
     */
    public function setPath($path) {
        $this->path = $path;

        return $this;
    }

    /**
     * Get path
     *
     * @return string 
     */
    public function getPath() {
        return $this->path;
    }

    /**
     * Set type
     *
     * @param string $type
     * @return Document
     */
    public function setType($type) {
        $this->type = $type;

        return $this;
    }

    /**
     * Get type
     *
     * @return string 
     */
    public function getType() {
        return $this->type;
    }

    /**
     * Set dateUploaded
     *
     * @param \DateTime $dateUploaded
     * @return Document
     */
    public function setDateUploaded($dateUploaded) {
        $this->dateUploaded = $dateUploaded;

        return $this;
    }

    /**
     * Get dateUploaded
     *
     * @return \DateTime 
     */
    public function getDateUploaded() {
        return $this->dateUploaded;
    }

    public function isImage() {
        $valid = ['jpg', 'jpeg', 'gif', 'png'];
        return in_array($this->extension, $valid);
    }

    public function isVideo() {
        $valid = ['mp4', 'avi', 'wmv', 'flv', 'mov', '3gp'];
        return in_array($this->extension, $valid);
    }

    public function isArchive() {
        $valid = ['zip', 'tar', 'rar', '7z'];
        return in_array($this->extension, $valid);
    }

    public function isDocument() {
        $valid = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'];
        return in_array($this->extension, $valid);
    }

    public function isAudio() {
        $valid = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'wma', 'mpga'];
        return in_array($this->extension, $valid);
    }

    private function getFolder() {

        if ($this->isImage()) {
            return "images";
        } elseif ($this->isVideo()) {
            return "videos";
        } elseif ($this->isAudio()) {
            return "audio";
        } elseif ($this->isArchive()) {
            return "archives";
        } elseif ($this->isDocument()) {
            return "documents";
        } elseif ($this->extension === "dwg") {
            return "blueprints";
        } else {
            return "others";
        }
    }

    /**
     * Set extension
     *
     * @param string $extension
     * @return Document
     */
    public function setExtension($extension) {
        $this->extension = $extension;

        return $this;
    }

    /**
     * Get extension
     *
     * @return string 
     */
    public function getExtension() {
        return $this->extension;
    }

}
