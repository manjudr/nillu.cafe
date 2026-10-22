# Pictures on this site

There are none yet, and that is a deliberate state rather than an unfinished
one. This note says where they go and what the page expects of them.

## Where they go

`src/assets/product/` — **read the README in that folder before generating or
shooting anything.** It has the aspect, the size, the safe area, the house
look, and prompts ready to paste into an image generator.

Drop a file named after a product id (`coffee`, `juice`, `bowl`, `bites`,
`desserts`) and that panel picks it up. Nothing is wired by hand, and no code
changes either way. Restart `npm run dev` after adding a new file.

## What a panel does without one

Falls back to a typographic card: the Kannada word large and centred, the
English name small beneath it, in the same bordered frame. It still tilts,
scales and turns with the scroll like a picture would. A page with three
pictures and two cards looks composed; it does not look broken.

## What happened to the earlier stand-ins

Three CC0 photographs from Wikimedia Commons sat in these slots for a while,
labelled "Stand-in photograph". They have been deleted. A photograph of
someone else's coffee is a picture of someone else's coffee however it is
captioned, and on a page whose whole argument is quality and care, that is the
wrong first impression.

A shader that drew each product as an animated ink form replaced them briefly.
It was honest and it moved well, but five abstract dark shapes do not make
anyone want a cheesecake. Also removed.

## The honesty rule, which still applies

An image generator will produce a picture of food that is not ours. For
`coffee`, `juice`, `bowl` and `bites` that is unremarkable — a cup of coffee
looks like a cup of coffee and nobody is misled.

`desserts` is different, because the panel names four real things we sell
right beside the picture. That item has `credit: true` set in
`src/data/menu.ts`, which prints a small "Illustration" line under the card.
Delete that line the day the picture is a photograph of our own counter.

Everything in `src/data/menu.ts` is still governed by the rule at the top of
that file: nothing on this site asserts a fact about how the café operates
unless Manjunath has confirmed it.
