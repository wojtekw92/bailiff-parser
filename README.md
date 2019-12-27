# bailiff-parser
Small parser for polish bailiff auctions page(http://licytacje.komornik.pl). 


## Public API:

### Sync API `depricated`:
`getCategoriesSync(callback)`
`getPageCountSync(category, callback)`
`getOffersSync(category, page, callback)`

## Async fucntions:
`getCategories()` - get list of all categories

Example output:
```
[
    {
        name: 'domy',
        id: '29'
    }
]
```

`getPageCount(category)` - get page count for category

`getOffers(category, page)` - get offers from page and category

`getAllOffers(category)` - get all offers form category

offers example output:
```
[
    {
        img: '../../Images/icons/category-icons/32.png',
        date: '30.12.2019',
        name:   'prawo użytkowania wieczystego nieruchomości gruntowej zabudowanej budynkami stan',
        city: 'Radom',
        dist: 'mazowieckie',
        price: '896 250,00 zł',
        offerId: '489280' 
    }
]
```
