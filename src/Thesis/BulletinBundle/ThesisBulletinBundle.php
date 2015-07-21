<?php

namespace Thesis\BulletinBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class ThesisBulletinBundle extends Bundle {

    public function getParent() {
        return 'FOSUserBundle';
    }

}
