# Leana Hub Guest House — build notes

## Reading of the brief
A professional, cinematic one-page site for Leana Hub Guest House, Potchefstroom, in the mood of the two
reference reels (dark, product-showcase sites: a slider where each item has its own colour world and a
giant ghosted name behind it with floating fruit; a dark wall of lit niches where one click zooms into an
item and shows its details). The one action: check availability / book (Booking.com deep link, or call /
WhatsApp 079 296 2187).

The reels are style references only. Imagery = the guesthouse's own 39 Booking.com photos (approved by user).

## Inventory (things only this client has)
1. Name: Leana Hub — "a hub in the heart of Potch".
2. 116 Rivier Street, Bailiepark, Potchefstroom 2520/2531, North West. "Rivier" = river; the Mooi River runs through town.
3. An old house kept, not gutted: stucco exterior, lofty pressed-tin ceilings, original pine floors.
4. Arched doorway and an arched fireplace alcove in the lounge (photos 583, 662, 674).
5. Antique carved upright piano in the hall (552, 765).
6. A lemon tree in the garden; complimentary fresh fruit from the garden (608, 587 bowl of lemons by the pool).
7. Year-round outdoor pool, garden terrace with outdoor dining, braai facilities, picnic spots.
8. Six rooms, each a decor of its own: navy velvet, protea prints, olive headboard, slate wall with teal,
   linen/single, pine with desk. Booking.com room types: Double Room with Private Bathroom; Family Room
   (1 single + 1 large double); Family Room with Garden View (2 singles + 1 large double, sleeps 4);
   Budget Double; Small Double (×2).
9. Every room: en-suite, air-con, bar fridge, tea & coffee, work desk, TV (Smart TV in select rooms), toiletries.
10. Hours: check-in 14:00–22:00, check-out 07:00–10:00, quiet hours 22:00–08:00. 24-hour front desk, private check-in.
11. Rules: children welcome, no cots/extra beds, no pets, no smoking, no parties.
12. Phone 079 296 2187. Google 4.4 (34 reviews). Booking.com staff score 8.0 (108 reviews).
13. Potchefstroom: oldest town of the old Transvaal (1838), on the Mooi River, home of North-West University,
    ~120 km from Johannesburg; Lanseria Airport 130 km; Country Club ~1 km; MooiRivier Mall, Riverwalk.

## Direction
Dealt: `pinned-poster` (seed 1413799831). Chosen over name-as-monument / uneven-photographs because the
references *are* this device: a frame that stays put while the items change. The arch of the house is that frame.

## The idea
On this page, **the arched doorway of the old house on Rivier Street** becomes **the pinned window**: the
first screen looks through an arch into the lounge and opens to the whole room; each room is shown in the
same arch and opens into its own colour world (the reel's slider), lit like a niche (the reel's wall).
Competitor test: "the arch of Road Lodge" does not exist — the arch, the lemons and the piano are this house's.

Floating 3D brass room keys drift around the hero arch (Three.js) — the reel's floating objects, made from the
house's own six rooms: each key hangs on an arch-shaped tag in its room's colour with the room's name; click one
to open that room. (Replaced the first version's lemons at the client's request, 2026-11-11.)

## The live thing
"Plan your stay": pick arrival date, nights and guests → it shows the check-in window for that day, the
check-out time and date, which of the six rooms sleep that party, and opens Booking.com with those dates
and guests filled in (or a WhatsApp message to Leana with the same details). Plus a live line in the hero
footer / booking section: "It's 15:20 in Potchefstroom — check-in is open until 22:00" (Africa/Johannesburg).
No-script fallback: plain links to Booking.com and the phone number.

## Argument (claim → proof)
1. Hero — Leana Hub is a guest house in a restored old house in Potch → the arch into the lounge, address, action.
2. Rooms — six en-suite rooms, each with its own character → six arched portraits pass a pinned "SIX ROOMS";
   each opens a room view (colour world, ghost name, gallery, beds, sleeps, features, book).
3. The house — the old house kept its character → full-bleed close-ups (fireplace, piano) with column cards.
4. Garden — outdoor life: pool all year, braai, outdoor table, lemon tree → rising triptych of garden photos.
5. Included — what every stay includes → sticky photograph + active list.
6. Around — where you are → place names running off the edges + sentence + map link.
7. Plan your stay — the live planner → Booking.com / WhatsApp with the details filled in.
8. Good to know — the house rules and practical answers → answers as reading text.
9. Contact — call or WhatsApp → the phone number as display type.
10. Footer — single quiet line.

## Sample / assumed content to confirm with the client
- Which photo belongs to which Booking.com room type (mapping is a best guess from decor; see ROOMS in js/main.js).
- Room nicknames (Navy, Protea, Olive, Slate, Linen, Pine) are descriptive names coined for the site.
- No prices shown (none published for these dates); Booking.com shows live rates.
- Email address: none found; contact is phone/WhatsApp only.
