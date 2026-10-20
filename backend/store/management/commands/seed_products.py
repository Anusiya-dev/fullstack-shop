from django.core.management.base import BaseCommand

from store.models import Product

SEED_PRODUCTS = [
    {'name': 'Linen Co-ord Set', 'price': 499, 'category': 'summer', 'image': '/image/coord.jpeg', 'badge': 'New', 'bg_class': 'p1'},
    {'name': 'Cotton Saree', 'price': 1499, 'category': 'summer', 'image': '/image/cottonsaree.jpeg', 'badge': 'New', 'bg_class': 'p1'},
    {'name': 'Floral Maxi Dress', 'price': 1499, 'category': 'summer', 'image': '/image/floralmaxi.jpeg', 'badge': 'New', 'bg_class': 'p1'},
    {'name': 'Floral Printed Maxi', 'price': 670, 'category': 'summer', 'image': '/image/floral.jpeg', 'badge': 'New', 'bg_class': 'p1'},
    {'name': 'Cotton Kurti', 'price': 799, 'category': 'summer', 'image': '/image/cottonkurti.jpeg', 'badge': None, 'bg_class': 'p4'},
    {'name': 'Chikankari Kurti', 'price': 879, 'category': 'summer', 'image': '/image/chikankari.jpeg', 'badge': None, 'bg_class': 'p8'},
    {'name': 'Silk Saree', 'price': 1399, 'category': 'festive', 'image': '/image/silksaree.jpeg', 'badge': None, 'bg_class': 'p2'},
    {'name': 'Half Saree', 'price': 1349, 'category': 'festive', 'image': '/image/halfsaree.jpeg', 'badge': 'New', 'bg_class': 'p5'},
    {'name': 'Festive Anarkali', 'price': 2349, 'category': 'festive', 'image': '/image/anarkali2.jpeg', 'badge': 'New', 'bg_class': 'p5'},
    {'name': 'Tissue Silk Saree', 'price': 1299, 'category': 'festive', 'image': '/image/tissuesilk.jpeg', 'badge': 'New', 'bg_class': 'p5'},
    {'name': 'Festive Anarkali 2', 'price': 2000, 'category': 'festive', 'image': '/image/anarkali.jpeg', 'badge': None, 'bg_class': 'p9'},
    {'name': 'Ivory Cotton Saree', 'price': 1000, 'category': 'minimal', 'image': '/image/ivorysaree.jpeg', 'badge': 'Popular', 'bg_class': 'p3'},
    {'name': 'Minimal Kurti', 'price': 870, 'category': 'minimal', 'image': '/image/salwar2.jpeg', 'badge': 'Popular', 'bg_class': 'p3'},
    {'name': 'Salwar Suit', 'price': 999, 'category': 'minimal', 'image': '/image/salwar.jpeg', 'badge': None, 'bg_class': 'p6'},
    {'name': 'Pearl Linen Saree', 'price': 1249, 'category': 'minimal', 'image': '/image/pearllinensaree.jpeg', 'badge': None, 'bg_class': 'p7'},
]


class Command(BaseCommand):
    help = 'Load FLORA catalog into SQLite'

    def handle(self, *args, **options):
        if Product.objects.exists():
            self.stdout.write(self.style.WARNING('Products already exist. Skipping seed.'))
            return
        for row in SEED_PRODUCTS:
            Product.objects.create(**row)
        self.stdout.write(self.style.SUCCESS(f'Created {len(SEED_PRODUCTS)} products.'))
