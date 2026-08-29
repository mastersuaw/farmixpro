<?php

namespace App\Enums;

enum InvoiceStatus: string
{
    case Open = 'open';
    case Closed = 'closed';
    case Cancelled = 'cancelled';
}
