<?php
namespace App\Enums;
enum TicketStatus:string { case OPEN='OPEN'; case IN_PROGRESS='IN_PROGRESS'; case NEED_INFO='NEED_INFO'; case ESCALATED='ESCALATED'; case RESOLVED='RESOLVED'; case CLOSED='CLOSED'; case REOPENED='REOPENED'; }
