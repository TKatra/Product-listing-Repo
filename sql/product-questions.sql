# connection
# hostname: 127.0.0.1
# username: root
# password: mysql
# database: webshop

# request all from table
SELECT * FROM {table}

# request all from table order by
SELECT * FROM {table} ORDER BY {order} {direction}

# request all products by category
SELECT products.* FROM products, pcategories WHERE products.catid = pcategories.id AND pcategories.name = "{category}" ORDER BY products.id;

# request all products by category order by
SELECT products.* FROM products, pcategories WHERE products.catid = pcategories.id AND pcategories.name = "{category}" ORDER BY {order} {direction};