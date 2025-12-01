# E-commerce SAGA System

Este proyecto implementa un sistema de gestión de pedidos utilizando arquitectura de Microservicios y el patrón SAGA (Orquestación) para cumplir con la rúbrica de evaluación.

## Tecnologías
- **NestJS**: Framework para Node.js (Arquitectura Hexagonal).
- **RabbitMQ**: Message Broker para comunicación asíncrona.
- **Docker & Kubernetes**: Contenerización y orquestación.

## Estructura
- `apps/orders`: Orquestador SAGA. Recibe pedidos HTTP y coordina con otros servicios.
- `apps/inventory`: Maneja el stock. Escucha eventos `reserve_stock` y `release_stock`.
- `apps/payments`: Procesa pagos (simulado con fallos aleatorios). Escucha `process_payment`.

## Ejecución con Docker Compose (Recomendado para Dev)
1. Construir e iniciar los servicios:
   ```bash
   docker-compose up --build
   ```
2. Crear un pedido (Happy Path):
   ```bash
   curl -X POST http://localhost:3000/orders -H "Content-Type: application/json" -d '{"productId": "123", "quantity": 1, "price": 10, "userId": "user1"}'
   ```
3. Ver logs para observar el flujo SAGA (Reserva -> Pago -> Confirmación o Compensación).

## Ejecución en Kubernetes
1. Asegúrate de tener un cluster local (ej. Minikube o Docker Desktop) y `kubectl`.
2. Construir las imágenes (si usas Docker local):
   ```bash
   docker build -t ecomerce-orders:latest --build-arg APP_NAME=orders .
   docker build -t ecomerce-inventory:latest --build-arg APP_NAME=inventory .
   docker build -t ecomerce-payments:latest --build-arg APP_NAME=payments .
   ```
3. Aplicar manifiestos:
   ```bash
   kubectl apply -f k8s/
   ```

## Cumplimiento de Rúbrica
- **RA1 (Hexagonal)**: Estructura modular en NestJS.
- **RA2 (Microservicios + SAGA)**: 3 servicios independientes comunicándose vía RabbitMQ con compensaciones.
- **RA3 (Casos avanzados)**: Manejo de fallos en pagos y reversión de stock.
- **RA4 (Despliegue)**: Archivos Docker y Kubernetes listos.
