//
//  SwiftUIView.swift
//  taskXPUITests
//
//  Created by Lin L on 3/15/25.
//

import SwiftUI

struct DuoCharacterView: View {
    @State private var eyeBlink = false
    @State private var mouthOpen = false
    @State private var handWave = false

    var body: some View {
        ZStack {
            Image("floor") // Background

            // Body
            Image("body")
                .resizable()
                .scaledToFit()

            // Face Components
            Image("face")
            Image(eyeBlink ? "eyelid" : "eyes")
                .animation(.easeInOut(duration: 0.1), value: eyeBlink)

            Image(mouthOpen ? "duoMouthOpen" : "duoMouth")
                .animation(.easeInOut(duration: 0.2), value: mouthOpen)

            // Hands
            Image("leftHand")
                .offset(x: -50, y: -10)

            Image("rightHand")
                .rotationEffect(.degrees(handWave ? 20 : -20))
                .animation(.easeInOut(duration: 0.3).repeatForever(autoreverses: true), value: handWave)
        }
        .onAppear {
            startAnimations()
        }
    }

    func startAnimations() {
        // Blinking Animation
        Timer.scheduledTimer(withTimeInterval: 3.0, repeats: true) { _ in
            withAnimation {
                eyeBlink.toggle()
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                withAnimation {
                    eyeBlink.toggle()
                }
            }
        }

        // Random Mouth Opening
        Timer.scheduledTimer(withTimeInterval: 2.5, repeats: true) { _ in
            withAnimation {
                mouthOpen.toggle()
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                withAnimation {
                    mouthOpen.toggle()
                }
            }
        }

        // Hand Waving
        handWave = true
    }
}

struct DuoCharacterView_Previews: PreviewProvider {
    static var previews: some View {
        DuoCharacterView()
    }
}

