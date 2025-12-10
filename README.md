
# Lumepath API Documentation

## TREE PROJECT 
```
.
├── ctrl
│   └── habitCTR.js
├── ldb.js
├── middleware
│   └── auth.js
├── models
│   ├── Group.js
│   ├── Habit.js
│   ├── Post.js
│   ├── Task.js
│   ├── Thread.js
│   └── User.js
├── package.json
├── package-lock.json
└── routes
    ├── auth.js
    ├── backup
    │   ├── auth.js.backup
    │   ├── habits.js.backup
    │   └── tasks.js.backup
    ├── habits.js
    ├── posts.js
    └── tasks.js

6 directories, 18 files
```
## API Endpoint
#### Important to know that every `api` endpoint start with dynamic dns, which everytime the url change, refer back to me if you want use the`api` meantime you need it's s to add reverse proxy or you can freely change `api` anytime, note to dont hardcoded your app with `api`. 

#### for an instance, `api` subdomain always change but the path always the same. e.g. `example3487.example.api` could change in the future to `example8234.example.api`.


### Base API


##### `/api/auth`
##### `/api/habits`
##### `/api/tasks`
##### `/api/posts`


#### `api` action and their dataset 
##### `/api/auth`: note that required fiels must be fill with data else server will return `500` error. `500` Happen bacause your dataset are not macthing with the server.
```json
{
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
};

```
action : 
- `/signup`
- `/login`
- `/me`
- `/logout`


`/api/habits` : 
```json
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  streak: { type: Number, default: 0},
  weeklyHistory: [{
    week: String,      // "2024-W10"
    year: Number,      // 2024
    weekNumber: Number, // 10
    completedDays: Number,
    totalDays: { type: Number, default: 7 },
    percentage: Number,
    perfectWeek: Boolean
  }]
}
```