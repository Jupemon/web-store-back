# Server running on heroku
Server for the ecommerce store i created, handles all transactions with the database and get/post/delete requests.

## Blog post

I wrote a blog post about this project : https://jupemon.blogspot.com/2020/02/what-i-learned-from-building-failed-e.html

## Web store project
My plan was to create an online e-commerce platform which could be used to sell candy, clothes, electronics, etc. (currently optimized for selling candy). The goal was to create a database for the products, interface for managing the products and another interface for selling the products. I was able to create a bunch of e-commerce functionalities until i eventually stopped working on it.

## Why it failed
I worked on the project for some time until i truly understood the work it would take to create something like an e-commerce platform all by yourself. I think there are much better alternatives if you want to setup an e-commerce store than building it yourself!

# Product management interface : https://jupemon.github.io/web-store-front-manage/
# Product selling interface : https://jupemon.github.io/web-store-front-customer/
# The server and database are running on heroku!

## Please read!
Adding new products to the database currently only works on localhost becouse heroku (where the server is deployed) doesnt allow direct file uploading. (I wish i would have know this... oh well) In order to enable product uploading you would have to attach some kind of external service where all the images get uploaded (Dropbox, Google Drive, etc.) And i dont think i will be adding anything else to the project
