const Category = require('../models/categoryModel')

// add category
exports.postCategory = async (req, res) => {
    let categoryExists = await Category.findOne({ category_name: req.body.category_name })
    if (categoryExists) {
        return res.status(400).json({ error: "Category already exists" })
    }

    let categoryToAdd = await Category.create({
        category_name: req.body.category_name
    })

    // let categoryToAdd = new Category({
    //     category_name : req.body.category_name
    // })
    // cateogryToAdd = await category.save()
    if (!categoryToAdd) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(categoryToAdd)
}

exports.getAllCategories = async (req, res) => {
    let categories = await Category.find()
    if (!categories) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(categories)
}

exports.getCategoryDetails = async (req, res) => {
    let category = await Category.findById(req.params.id)
    if (!category) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(category)
}

exports.updateCategory = async (req, res) => {
    try {
        let categoryToUpdate = await Category.findByIdAndUpdate(req.params.id, {
            category_name: req.body.category_name
        }, { new: true })
        if (!categoryToUpdate) {
            return res.status(400).json({ error: "Something went wrong" })
        }
        res.send(categoryToUpdate)
    }
    catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

exports.deleteCategory = (req, res) => {
    Category.findByIdAndDelete(req.params.id)
    .then(categoryDeleted=>{
        if(!categoryDeleted){
            return res.status(400).json({error:"Category not found"})
        }
        res.send({message:"Category deleted successfully"})
    })
    .catch(error=>res.status(400).json({error:error.message}))
}


/*
Category.create({
    category_name: req.body.category_name
})
.then((categoryToAdd)=>{
    if(!categoryToAdd){
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(categoryToAdd)
})
.catch(error=>res.status(400).json({error: error.message}))



CRUD 

Model.create({}) - create new object

Model.find() - returns all data in Model
Model.find(filter_obj) - returns all data that matches filter_obj
Model.findOne(filter_obj) - returns particular data that matches filter_obj
Model.findById(id) - returns particular data with id



*/





{/* 
req.body ->
<form>
    <input type='text' name='category_name' />
 
</form> 

/addcategory/new_category
req.params.-var -> url

/?name=something
req.query.-var
*/}

/*

res.send(obj) -> obj 
res.send("string") -> string
res.json(json_object) -> json_object
res.status(status_code).json(json_object)
        status_code: 
            200 : OK
            301 : relay
            400 : bad request
            401 : authentication error
            500/600 : server error
*/
