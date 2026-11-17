# Capstone Reflection

## What Was Hardest & Why
Designing the recommendation endpoint so it never fails silently—handling missing LLM keys, upstream timeouts, and strict TypeScript types—required careful boundary validation between server and client.

## What I Would Do Differently Next Time
Write unit tests for the data and ranking functions on Day 1 before building the UI routes.

## One Thing That Surprised Me
Comparing hand-built W3C ARIA components against shadcn/ui showed how critical portal stacking contexts, body scroll locks, and inert background handling are for real screen reader users.
