app.get('/product', async (req, res, next) => {

    const {size} = req.query;
    if (size) {
        const products = await Product.find({size});
        res.render('product/index', {products});
    }
    
    const products = await Product.find({});
    res.render('product/index', {products});
});

app.post('/product', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.redirect(`/product/${product._id}`);
});

app.get('/product/create', (req, res) => {
    res.render('product/create');
});

app.put('/product/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true});
    res.redirect('/product/' + product._id);
});

app.delete('/product/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/product');
});

app.get('/product/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('product/edit', {product});
}));

app.get('/product/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.render('product/show', {product});
    } catch (error) {
        next(new ErrorHandler('<h1>Gak Jumpa Bang Produknya</h1>', 404))
    }
});
