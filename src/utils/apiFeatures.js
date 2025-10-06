class ApiFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    // filtering loginc
    filter(){
        // Method: 4th:-########## role1;
        // console.log("this.queryStr ---> ", this.queryStr )
        let queryString = JSON.stringify(this.queryStr);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        
        const queryObj = JSON.parse(queryString);  //converting to js object 
        // let query = Movie.find(queryObj);
        this.query = this.query.find(queryObj);

        return this;
    }

        // SORTING LOGIC
    sort(){
        // console.log(this.queryStr)
        if (this.queryStr.sort) {
            let sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);

            // this.query.sort('duration releaseYear ratings')

        } else {
            this.query = this.query.sort('-createdAt -price');
        }

        return this;
    }

    // LIMITING FIELDS
    limitFields(){
        if (this.queryStr.fields) {
            // query = query.select('name duration price ratings');
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }    

    // PAGINATION
    paginate(){
        // query = query.skip(5).limit(5);

        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 10;
        // PAGE 1: 1-5; PAGE 2: 6-10; PAGE 3: 11-15;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        // if (this.queryStr.page) {
        //     const moviesCount = await Movie.countDocuments();
        //     if (skip >= moviesCount) {
        //         throw new Error("This page is not found");
        //     }
        // }

        return this;
    }
}


module.exports = ApiFeatures