// Query 4
// Find user pairs (A,B) that meet the following constraints:
// i) user A is male and user B is female
// ii) their Year_Of_Birth difference is less than year_diff
// iii) user A and B are not friends
// iv) user A and B are from the same hometown city
// The following is the schema for output pairs:
// [
//      [user_id1, user_id2],
//      [user_id1, user_id3],
//      [user_id4, user_id2],
//      ...
//  ]
// user_id is the field from the users collection. Do not use the _id field in users.
// Return an array of arrays.
//Find the oldest friend for each user who has friends. For simplicity, use only the YOB field to determine age. In case of a tie, return the friend with the smallest user_id.

//Notice in the users collection, 
// 
// each user only has information on friends whose 
// user_id is greater than their user_id. You will need to consider all existing friendships. It may be helpful to go over some of the strategies you used in Queries 2 and 3. Collections created by your queries such as flat_user and cities will not persist across test cases in the Autograder. If you want to re-use any of these collections, you should create them again in the corresponding queries.


function suggest_friends(year_diff, dbname) {
    db = db.getSiblingDB(dbname);

    let pairs = [];
    db.users.aggregate([
        {$or: 
    ]);

    

  





    return pairs;
}
