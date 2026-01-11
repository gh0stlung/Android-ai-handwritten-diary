import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

// --- MAIN ENTRY POINT ---
void main() {
  runApp(const DiaryApp());
}

class DiaryApp extends StatelessWidget {
  const DiaryApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Nostalgia Diary',
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF3E2723), // Vintage brown seed
        scaffoldBackgroundColor: const Color(0xFFFDFBF7), // Paper color
      ),
      home: const DiaryPage(),
    );
  }
}

// --- CORE UI PAGE ---
class DiaryPage extends StatefulWidget {
  const DiaryPage({super.key});

  @override
  State<DiaryPage> createState() => _DiaryPageState();
}

class _DiaryPageState extends State<DiaryPage> {
  // The buffer holding the raw text
  final TextEditingController _textController = TextEditingController();
  final FocusNode _focusNode = FocusNode();
  
  // Configuration State
  Color _inkColor = const Color(0xFF1A237E); // Midnight Blue
  double _fontSize = 24.0;
  
  @override
  void initState() {
    super.initState();
    // Placeholder text
    _textController.text = "Dear Diary,\n\nThis is the native Flutter implementation of the engine. Notice how the text renders as strokes on the canvas.\n\nThe input field is hidden, but active.";
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Transparent app bar to blend with paper
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.black54),
          onPressed: () {},
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.calendar_today, color: Colors.black54),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.settings, color: Colors.black54),
            onPressed: () {},
          ),
        ],
      ),
      body: Stack(
        children: [
          // 1. PAPER LAYER (Visuals)
          Positioned.fill(
            child: GestureDetector(
              onTap: () => _focusNode.requestFocus(),
              child: CustomPaint(
                painter: DiaryPaperPainter(),
                foregroundPainter: HandwritingPainter(
                  text: _textController.text,
                  inkColor: _inkColor,
                  fontSize: _fontSize,
                ),
                child: Container(),
              ),
            ),
          ),
          
          // 2. INPUT LAYER (Invisible but Functional)
          // We use a TextField positioned off-screen or with invisible text
          // to capture keyboard events and IME updates.
          Positioned(
            left: -9999, 
            child: SizedBox(
              width: 100,
              child: TextField(
                controller: _textController,
                focusNode: _focusNode,
                maxLines: null,
                keyboardType: TextInputType.multiline,
                onChanged: (val) {
                  // Trigger rebuild of the CustomPainter
                  setState(() {}); 
                },
              ),
            ),
          ),
          
          // 3. FLOATING TOOLS
          Positioned(
            bottom: 32,
            right: 32,
            child: FloatingActionButton(
              backgroundColor: const Color(0xFF212121),
              onPressed: () {
                // Toggle ink color for demo
                setState(() {
                  _inkColor = _inkColor == const Color(0xFF1A237E) 
                      ? const Color(0xFFB71C1C) 
                      : const Color(0xFF1A237E);
                });
              },
              child: const Icon(Icons.edit, color: Colors.white),
            ),
          )
        ],
      ),
    );
  }
}

// --- PAINTER 1: THE PAPER (Background) ---
class DiaryPaperPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF90A4AE).withOpacity(0.3) // Light blue lines
      ..strokeWidth = 1.0;

    final marginPaint = Paint()
      ..color = const Color(0xFFEF5350).withOpacity(0.2) // Red margin
      ..strokeWidth = 1.5;

    const double lineHeight = 32.0;
    const double topMargin = 80.0;
    const double leftMargin = 60.0;

    // Draw horizontal lines
    for (double y = topMargin; y < size.height; y += lineHeight) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }

    // Draw vertical margin
    canvas.drawLine(
      const Offset(leftMargin, 0), 
      const Offset(leftMargin, size.height), 
      marginPaint
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// --- PAINTER 2: THE HANDWRITING (AI Engine) ---
class HandwritingPainter extends CustomPainter {
  final String text;
  final Color inkColor;
  final double fontSize;

  HandwritingPainter({
    required this.text,
    required this.inkColor,
    required this.fontSize,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // Configuration
    const double lineHeight = 32.0;
    const double topMargin = 80.0;
    const double leftMargin = 70.0; // Slightly right of the red line
    const double rightMargin = 20.0;
    final double maxWidth = size.width - leftMargin - rightMargin;

    // We use TextPainter to measure and draw text. 
    // In a real "AI" implementation, you would use path metrics 
    // to draw strokes, but for this level of implementation, 
    // manipulating individual characters via TextPainter is efficient and effective.

    // Style using a handwriting font (Google Fonts must be initialized in pubspec.yaml)
    // Fallback to standard if not loaded
    final textStyle = GoogleFonts.indieFlower(
      fontSize: fontSize,
      color: inkColor,
    );

    double cursorX = leftMargin;
    double cursorY = topMargin - (lineHeight * 0.35); // Align baseline

    // Split text into paragraphs
    final paragraphs = text.split('\n');

    // Pseudo-random generator seeded by character index
    // This ensures that typing "a" always looks like that specific "a" 
    // until it's deleted, preventing the whole page from shimmering.
    int charCounter = 0;
    final Random random = Random(42);

    for (int p = 0; p < paragraphs.length; p++) {
      if (p > 0) {
        // New paragraph -> New line
        cursorY += lineHeight;
        cursorX = leftMargin;
      }

      final words = paragraphs[p].split(' ');

      for (var word in words) {
        // Measure word to check for wrap
        final wordSpan = TextSpan(text: word, style: textStyle);
        final wordPainter = TextPainter(
          text: wordSpan,
          textDirection: TextDirection.ltr,
        );
        wordPainter.layout();

        if (cursorX + wordPainter.width > leftMargin + maxWidth) {
          cursorY += lineHeight;
          cursorX = leftMargin;
        }

        // Draw character by character for "AI" jitter
        for (int i = 0; i < word.length; i++) {
          final char = word[i];
          final charSpan = TextSpan(text: char, style: textStyle);
          final charPainter = TextPainter(
            text: charSpan,
            textDirection: TextDirection.ltr,
          );
          charPainter.layout();

          // Calculate Jitter
          // We use sine waves based on the counter to create deterministic noise
          final double jitterY = sin(charCounter * 12.3) * 1.5; 
          final double rotate = cos(charCounter * 7.8) * 0.08; 
          final double scale = 1.0 + (sin(charCounter * 9.9) * 0.05);

          canvas.save();
          // Move to position + jitter
          canvas.translate(cursorX, cursorY + jitterY);
          canvas.rotate(rotate);
          canvas.scale(scale);
          
          charPainter.paint(canvas, Offset.zero);
          
          canvas.restore();

          // Advance cursor
          cursorX += charPainter.width;
          charCounter++;
        }

        // Space
        final spacePainter = TextPainter(
          text: TextSpan(text: ' ', style: textStyle),
          textDirection: TextDirection.ltr,
        )..layout();
        
        cursorX += spacePainter.width;
        charCounter++;
      }
    }
  }

  @override
  bool shouldRepaint(covariant HandwritingPainter oldDelegate) {
    return oldDelegate.text != text || 
           oldDelegate.inkColor != inkColor;
  }
}
