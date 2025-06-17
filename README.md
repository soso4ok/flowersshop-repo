# Flower Shop Application

Welcome to the **Flower Shop** project! This is a Java-based application designed to help manage the operations of a flower shop— from inventory tracking to order processing.

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Configuration](#configuration)  
- [Usage](#usage)  
- [Running Tests](#running-tests)  
- [Contributing](#contributing)  
- [License](#license)  
- [Contact](#contact)  

## Features

- Inventory management for different flower types  
- Order creation and processing  
- Customer data storage  
- Reporting of sales and inventory levels  
- Input validation and error handling  

## Tech Stack

- Java 11 (or higher)  
- Maven for build and dependency management  

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- Java Development Kit (JDK) 11 or higher  
- Apache Maven 3.6+  

Verify installation with:

```bash
java -version
mvn -v
```

### Installation

1. Clone the repository  
   ```bash
   git clone https://github.com/soso4ok/flowersshop-repo.git
   cd flowersshop-repo
   ```  
2. Build the project and download dependencies:  
   ```bash
   mvn clean install
   ```

### Configuration

If the application requires any external configuration (e.g., database URL, API keys), create a `config.properties` file in the `src/main/resources` directory and add your settings:

```properties
# src/main/resources/config.properties
db.url=jdbc:mysql://localhost:3306/flowershop
db.user=your_username
db.password=your_password
```

## Usage

Run the application using Maven:

```bash
mvn exec:java -Dexec.mainClass="com.flowershop.Main"
```

Alternatively, you can run the compiled JAR:

```bash
java -jar target/flowershop-1.0.0.jar
```

Follow the on-screen prompts to manage inventory, create orders, and view reports.

## Running Tests

Execute unit and integration tests with:

```bash
mvn test
```

Test reports will be generated under `target/surefire-reports`.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/YourFeature`)  
3. Commit your changes (`git commit -m "Add some feature"`)  
4. Push to the branch (`git push origin feature/YourFeature`)  
5. Open a Pull Request describing your changes  

Please adhere to the existing coding style and include unit tests for any new functionality.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

- **Author:** soso4ok  
- **GitHub:** https://github.com/soso4ok/flowersshop-repo  
- **Email:** vorobiovvolodymyr@gmail.com

Happy coding! 🌸  
