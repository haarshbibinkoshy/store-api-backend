const Product = require("../models/product")

const getAllProductsStatic=async(req,res,next) => {
    const products= await Product.find().select('name').limit(40).skip(10)
    // const products= await Product.find({featured:true})
    res.status(200).json({products,nbHits:products.length})
}

const getAllProducts=async(req,res,next) => {
    
    // const products= await Product.find(req.query)
    const {featured,company,name,sort,field,page,numericFilters}=req.query
    
    const queryObj={}

    if (featured) {
        queryObj.featured=featured==true?true:false
    }
    if (company) {
        queryObj.company=company
    }
    if (name) {
        queryObj.name={$regex:name,$options:'i'}
    }

    if (numericFilters) {
        const operatorsMap={
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',
        }
        const regEx=/\b(<|>|>=|=|<|<=)\b/g;
        let filters=numericFilters.replace(regEx,(match)=>
        `-${operatorsMap[match]}-`)

        const options=[`price`,`rating`]
        filters=filters.split(',').forEach(item => {
            const [field,operator,value]=item.split('-')
            if (options.includes(field)) {
                queryObj[field]={[operator]:Number(value) }
            }
        })
        console.log(queryObj);
    }
    console.log(queryObj);

    let result= Product.find(queryObj)
    

    if (sort) {
        let sortList=sort.split(',').join(' ')
        
        result=result.sort(sortList) 
    }else{
        
        result=result.sort('createdAt')
    }

    if (field) {
        let selectList=field.split(',').join(' ')
        result=result.select(selectList)
    }
//pagination
    let limit=10
    let skip=(Number(page)-1)*limit

    result= result.limit(limit).skip(skip)
    const products= await result
    res.status(200).json({products,nbHits:products.length})

    // if (featured) {
    //     console.log(`inside`);
    //     res.status(200).json({products,nbHits:products.length})
    // }else{
    //     res.status(200).json({products,nbHits:products.length})
    // }
    
}

module.exports ={
    getAllProducts,
    getAllProductsStatic
}