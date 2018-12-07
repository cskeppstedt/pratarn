# If the directory, `build`, doesn't exist, create `build`
stat build || mkdir build
# Archive artifacts
zip pratarn-app-package.zip -r build package.json package-lock.json