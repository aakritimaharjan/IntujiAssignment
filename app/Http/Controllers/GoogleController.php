<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Google\Client as GoogleClient;
use Google\Service\Calendar;

class GoogleController extends Controller
{
    public function redirectToGoogle()
    {
        $client = new GoogleClient();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect'));
        // $client->addScope(Calendar::CALENDAR_READONLY);
        $client->addScope(Calendar::CALENDAR);

        return redirect()->away($client->createAuthUrl());
    }

    public function handleGoogleCallback(Request $request)
    {
        $client = new GoogleClient();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect'));
        $client->addScope(Calendar::CALENDAR);

        $client->fetchAccessTokenWithAuthCode($request->code);

        session()->put('token', $client->getAccessToken()['access_token']);
        
        return redirect('/');
    }

    public function getFilters() {
        $client = new GoogleClient();
        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $client->setRedirectUri(env('GOOGLE_REDIRECT_URI'));
        $client->setAccessToken(session()->get('token'));

        $service = new Calendar($client);
        $calendarList = $service->calendarList->listCalendarList();

        $calendars = [];
        foreach ($calendarList->getItems() as $calendarListEntry) {
            if ($calendarListEntry->primary) {
                $calendars[] = [
                    'id' => 'primary',
                    'summary' => 'Primary',
                ];
            } else {
                $calendars[] = [
                    'id' => $calendarListEntry->getId(),
                    'summary' => $calendarListEntry->getSummary(),
                ];
            }
        }

        return response()->json(['calendars' => $calendars]);
    }

    public function getEvents(Request $request) {
        $client = new GoogleClient();
        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $client->setRedirectUri(env('GOOGLE_REDIRECT_URI'));
        $client->setAccessToken(session()->get('token'));

        
        $service = new Calendar($client);
        $calendarId = $request->calendarId;
        $optParams = [
            // 'maxResults' => 10,
            'orderBy' => 'startTime',
            'singleEvents' => true,
            // 'timeMin' => date('c'),
            'timeMin' => now()->startOfMonth()->toRfc3339String(),
            'timeMax' => now()->endOfMonth()->toRfc3339String(),
        ];
        $results = $service->events->listEvents($calendarId, $optParams);
        $events = $results->getItems();

        return response()->json(['events' => $events]);
    }

    public function createEvent(Request $request)
    {
        $client = new GoogleClient();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect'));
        $client->setAccessToken(session()->get('token'));

        $service = new Calendar($client);

        $event = new \Google\Service\Calendar\Event([
            'summary' => $request->title,
            'description' => $request->description,
            'start' => [
                'dateTime' => $request->start, // format: '2022-10-01T10:00:00-07:00'
                'timeZone' => 'America/Los_Angeles',
            ],
            'end' => [
                'dateTime' => $request->end, // format: '2022-10-01T10:25:00-07:00'
                'timeZone' => 'America/Los_Angeles',
            ],
        ]);

        $calendarId = 'primary';
        $event = $service->events->insert($calendarId, $event);

        return response()->json($event);
    }

    public function updateEvent(Request $request)
    {
        $client = new GoogleClient();
        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $client->setRedirectUri(env('GOOGLE_REDIRECT_URI'));
        $client->setAccessToken(session()->get('token'));

        $service = new Calendar($client);
        $calendarId = $request->calendarId;
        $eventId = $request->eventId;

        $event = $service->events->get($calendarId, $eventId);
        $event->setSummary($request->title);
        $event->setDescription($request->description);
        $event->setStart(new \Google\Service\Calendar\EventDateTime([
            'dateTime' => $request->start,
            'timeZone' => 'UTC',
        ]));
        $event->setEnd(new \Google\Service\Calendar\EventDateTime([
            'dateTime' => $request->end,
            'timeZone' => 'UTC',
        ]));

        $updatedEvent = $service->events->update($calendarId, $event->getId(), $event);

        return response()->json(['event' => $updatedEvent]);
    }

    public function deleteEvent(Request $request)
    {
        $client = new GoogleClient();
        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $client->setRedirectUri(env('GOOGLE_REDIRECT_URI'));
        $client->setAccessToken(session()->get('token'));

        $service = new Calendar($client);
        $calendarId = $request->calendarId;
        $eventId = $request->eventId;

        $service->events->delete($calendarId, $eventId);

        return response()->json(['message' => 'Event deleted successfully']);
    }

}
