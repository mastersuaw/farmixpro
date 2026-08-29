<?php

namespace App\Enums;

enum TipoReferencia: string
{
    case Invoice = 'invoice';
    case Payment = 'payment';
    case Adjustment = 'adjustment';
}
