Installation

You need to install dependencies for all three sub-projects. Open your terminal at the project root and run:

### A. Backend
```bash
cd backend
npm install
```

### B. Dashboard Frontend (Campus Buddy)
```bash
cd ../campus-buddy-fe
npm install
```

### C. Landing Page / Host (Intro FE)
```bash
cd ../intro-fe
npm install
```

then, run command 'npm run dev' for all A, B and C


For this project, please follow the workflow below:

```git checkout main```
```git pull origin main```

For example, If you are working on login feature,
```git checkout -b feature/login-button```

after code change, commit and push the code. Then, request for pull request.
After pull request successfull, swith back to main
```git checkout main```
```git pull origin main```

Now you have main branch with your new code implemented.

delete your old branch to keep branches clean.
```git branch -d feature/login-button```
