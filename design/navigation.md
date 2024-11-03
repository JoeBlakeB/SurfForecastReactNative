# Navigation of Screens

Each block represents one screen of the app. Blocks in a section represent tabbed navigation, where the highlighted block is the default tab.

```mermaid
block-beta
columns 4

block:Home:4
    Favorites
    Explore
    News
    Account
end

space:2
News-->Article
space

block:Beach:4
    Favorites-->Today
    Explore-->Today
    Today["Todays Summary"]
    Forecast["16 Day Forecast"]
end

space:4
Today-->Camera["Live Camera"]

style Favorites fill:#749
style Today fill:#749
```
